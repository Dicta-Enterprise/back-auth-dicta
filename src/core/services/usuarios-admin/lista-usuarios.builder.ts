import {
  EstadoUsuarioAdmin,
  FilaFamiliaBase,
  FilaUsuarioBase,
  FiltrosUsuariosAdmin,
  ListaUsuariosAdmin,
  RolLms,
  UsuarioAdmin,
} from '../../entities/usuario-admin/usuario-admin.entity';
import {
  formatearIdFamilia,
  formatearIdUsuario,
  interpretarId,
  TipoUsuario,
} from '../identificadores/identificadores';

const ROL_POR_TIPO: Record<TipoUsuario, RolLms> = { P: 'PADRE', N: 'NINO', J: 'JOVEN' };
const ROL_PENDIENTE = 4;
const LIMITE_POR_DEFECTO = 20;
const LIMITE_MAXIMO = 100;

const normalizar = (texto: string): string =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

function tipoDe(fila: FilaUsuarioBase): TipoUsuario {
  if (!fila.cuentaComoHijo) return 'P';
  return fila.cuentaComoHijo.tipocuenta === 'JOVEN' ? 'J' : 'N';
}

function estadoDe(fila: FilaUsuarioBase): EstadoUsuarioAdmin {
  if (fila.estado === 0) return 'INACTIVA';
  if (fila.cuentaComoHijo) return fila.cuentaComoHijo.estado as EstadoUsuarioAdmin;
  // Un padre que todavía no ha completado su registro (rol "usuario pendiente").
  return fila.idrol === ROL_PENDIENTE ? 'PENDIENTE' : 'ACTIVA';
}

function aUsuarioAdmin(fila: FilaUsuarioBase, familiaPorPadre: Map<number, FilaFamiliaBase>): UsuarioAdmin {
  const tipo = tipoDe(fila);
  const idPadre = fila.cuentaComoHijo ? fila.cuentaComoHijo.idpadre : fila.id;
  const familia = familiaPorPadre.get(idPadre);

  return {
    id: fila.id,
    codigo: formatearIdUsuario(tipo, fila.id),
    tipo,
    rol: ROL_POR_TIPO[tipo],
    nombre: (fila.cuentaComoHijo?.alias || fila.username),
    email: fila.email,
    estado: estadoDe(fila),
    familia: familia
      ? { id: familia.id, codigo: formatearIdFamilia(familia.id), nombre: familia.nombre }
      : null,
    fechaRegistro: fila.fechadecreacion,
  };
}

function coincideId(usuario: UsuarioAdmin, textoId: string): boolean {
  const buscado = interpretarId(textoId);
  if (!buscado) return false;
  if (buscado.clase === 'FAMILIA') return usuario.familia?.id === buscado.id;
  return usuario.id === buscado.id && (!buscado.tipo || usuario.tipo === buscado.tipo);
}

function coincideFamilia(usuario: UsuarioAdmin, texto: string): boolean {
  if (!usuario.familia) return false;
  const limpio = texto.trim();
  // En este filtro un número suelto es el id de la familia, no el de un usuario.
  if (/^\d+$/.test(limpio)) return usuario.familia.id === Number(limpio);
  const buscado = interpretarId(limpio);
  if (buscado?.clase === 'FAMILIA') return usuario.familia.id === buscado.id;
  return normalizar(usuario.familia.nombre ?? '').includes(normalizar(limpio));
}

function coincideTexto(usuario: UsuarioAdmin, texto: string): boolean {
  const buscado = normalizar(texto.trim());
  if (!buscado) return true;
  const campos = [
    usuario.nombre,
    usuario.email,
    usuario.codigo,
    usuario.familia?.nombre ?? '',
    usuario.familia?.codigo ?? '',
  ];
  return campos.some((campo) => normalizar(campo).includes(buscado));
}

/**
 * Convierte las filas de la base en la lista que ve el administrador: calcula tipo, estado,
 * códigos y familia, aplica los filtros y pagina. No toca la base de datos.
 */
export function construirListaUsuarios(
  usuarios: FilaUsuarioBase[],
  familias: FilaFamiliaBase[],
  filtros: FiltrosUsuariosAdmin = {},
): ListaUsuariosAdmin {
  const familiaPorPadre = new Map(familias.map((f) => [f.idpadre, f]));

  let lista = usuarios.map((fila) => aUsuarioAdmin(fila, familiaPorPadre));

  if (filtros.id) lista = lista.filter((u) => coincideId(u, filtros.id as string));
  if (filtros.familia) lista = lista.filter((u) => coincideFamilia(u, filtros.familia as string));
  if (filtros.rol) lista = lista.filter((u) => u.rol === filtros.rol);
  if (filtros.estado) lista = lista.filter((u) => u.estado === filtros.estado);
  if (filtros.q) lista = lista.filter((u) => coincideTexto(u, filtros.q as string));
  if (filtros.desde) {
    lista = lista.filter((u) => u.fechaRegistro !== null && u.fechaRegistro >= (filtros.desde as Date));
  }
  if (filtros.hasta) {
    lista = lista.filter((u) => u.fechaRegistro !== null && u.fechaRegistro <= (filtros.hasta as Date));
  }

  // Más recientes primero; los que no tienen fecha de registro, al final.
  lista.sort((a, b) => {
    const fa = a.fechaRegistro ? a.fechaRegistro.getTime() : -Infinity;
    const fb = b.fechaRegistro ? b.fechaRegistro.getTime() : -Infinity;
    return fb !== fa ? fb - fa : b.id - a.id;
  });

  const limit = Math.min(Math.max(filtros.limit ?? LIMITE_POR_DEFECTO, 1), LIMITE_MAXIMO);
  const page = Math.max(filtros.page ?? 1, 1);
  const inicio = (page - 1) * limit;

  return { items: lista.slice(inicio, inicio + limit), total: lista.length, page, limit };
}

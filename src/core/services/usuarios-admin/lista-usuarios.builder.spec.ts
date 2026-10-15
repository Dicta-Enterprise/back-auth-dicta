import { construirListaUsuarios } from './lista-usuarios.builder';
import { FilaFamiliaBase, FilaUsuarioBase } from '../../entities/usuario-admin/usuario-admin.entity';
import { formatearIdFamilia, formatearIdUsuario, interpretarId } from '../identificadores/identificadores';

describe('identificadores', () => {
  it('arma los códigos con tipo y relleno', () => {
    expect(formatearIdUsuario('P', 14)).toBe('USR-P-014');
    expect(formatearIdUsuario('N', 32)).toBe('USR-N-032');
    expect(formatearIdUsuario('J', 9)).toBe('USR-J-009');
    expect(formatearIdFamilia(14)).toBe('FAM-014');
  });

  it('interpreta lo que escribe el administrador', () => {
    expect(interpretarId('USR-N-032')).toEqual({ clase: 'USUARIO', tipo: 'N', id: 32 });
    expect(interpretarId(' usr-j-9 ')).toEqual({ clase: 'USUARIO', tipo: 'J', id: 9 });
    expect(interpretarId('FAM-014')).toEqual({ clase: 'FAMILIA', id: 14 });
    expect(interpretarId('fam14')).toEqual({ clase: 'FAMILIA', id: 14 });
    expect(interpretarId('32')).toEqual({ clase: 'USUARIO', id: 32 });
    expect(interpretarId('hola')).toBeNull();
    expect(interpretarId('')).toBeNull();
  });
});

const fecha = (d: string) => new Date(d);

// padre 18 con dos hijos (20 niña, 21 joven) y familia 1; padre 30 pendiente sin familia
const usuarios: FilaUsuarioBase[] = [
  { id: 18, username: 'familia_prueba_1', email: 'p1@x.co', idrol: 3, estado: 1, fechadecreacion: fecha('2026-10-02'), cuentaComoHijo: null },
  { id: 20, username: 'sofia', email: 'sofia@x.co', idrol: 4, estado: 1, fechadecreacion: fecha('2026-10-03'), cuentaComoHijo: { tipocuenta: 'NINO', alias: 'Sofía', estado: 'ACTIVA', idpadre: 18 } },
  { id: 21, username: 'mateo', email: 'mateo@x.co', idrol: 4, estado: 1, fechadecreacion: fecha('2026-10-04'), cuentaComoHijo: { tipocuenta: 'JOVEN', alias: 'Mateo', estado: 'INACTIVA', idpadre: 18 } },
  { id: 30, username: 'jorge', email: 'jorge@x.co', idrol: 4, estado: 1, fechadecreacion: fecha('2026-10-05'), cuentaComoHijo: null },
];
const familias: FilaFamiliaBase[] = [{ id: 1, idpadre: 18, nombre: 'Familia Rodríguez' }];

describe('construirListaUsuarios', () => {
  it('calcula tipo, código, estado y familia de cada usuario', () => {
    const { items } = construirListaUsuarios(usuarios, familias);
    const porId = Object.fromEntries(items.map((u) => [u.id, u]));
    expect(porId[18]).toMatchObject({ codigo: 'USR-P-018', rol: 'PADRE', estado: 'ACTIVA' });
    expect(porId[20]).toMatchObject({ codigo: 'USR-N-020', rol: 'NINO', nombre: 'Sofía', estado: 'ACTIVA' });
    expect(porId[21]).toMatchObject({ codigo: 'USR-J-021', rol: 'JOVEN', estado: 'INACTIVA' });
    expect(porId[30]).toMatchObject({ rol: 'PADRE', estado: 'PENDIENTE', familia: null });
    // los hijos heredan la familia de su padre
    expect(porId[20].familia).toEqual({ id: 1, codigo: 'FAM-001', nombre: 'Familia Rodríguez' });
  });

  it('ordena del más reciente al más antiguo', () => {
    expect(construirListaUsuarios(usuarios, familias).items.map((u) => u.id)).toEqual([30, 21, 20, 18]);
  });

  it('filtra por ID de usuario, de familia y por número suelto', () => {
    expect(construirListaUsuarios(usuarios, familias, { id: 'USR-N-020' }).items.map((u) => u.id)).toEqual([20]);
    expect(construirListaUsuarios(usuarios, familias, { id: 'USR-J-020' }).items).toEqual([]);
    expect(construirListaUsuarios(usuarios, familias, { id: 'FAM-001' }).items.map((u) => u.id).sort()).toEqual([18, 20, 21]);
    expect(construirListaUsuarios(usuarios, familias, { id: '30' }).items.map((u) => u.id)).toEqual([30]);
    expect(construirListaUsuarios(usuarios, familias, { id: 'basura' }).total).toBe(0);
  });

  it('filtra por rol, estado y familia', () => {
    expect(construirListaUsuarios(usuarios, familias, { rol: 'PADRE' }).total).toBe(2);
    expect(construirListaUsuarios(usuarios, familias, { estado: 'PENDIENTE' }).items.map((u) => u.id)).toEqual([30]);
    expect(construirListaUsuarios(usuarios, familias, { familia: 'FAM-001' }).total).toBe(3);
    expect(construirListaUsuarios(usuarios, familias, { familia: '1' }).total).toBe(3);
    expect(construirListaUsuarios(usuarios, familias, { familia: 'rodriguez' }).total).toBe(3);
  });

  it('busca por texto sin importar tildes ni mayúsculas', () => {
    expect(construirListaUsuarios(usuarios, familias, { q: 'SOFIA' }).items.map((u) => u.id)).toEqual([20]);
    expect(construirListaUsuarios(usuarios, familias, { q: 'rodríguez' }).total).toBe(3);
  });

  it('filtra por fecha de registro', () => {
    const r = construirListaUsuarios(usuarios, familias, { desde: fecha('2026-10-04'), hasta: fecha('2026-10-05') });
    expect(r.items.map((u) => u.id)).toEqual([30, 21]);
  });

  it('pagina y respeta el límite máximo', () => {
    const r = construirListaUsuarios(usuarios, familias, { page: 2, limit: 3 });
    expect(r).toMatchObject({ total: 4, page: 2, limit: 3 });
    expect(r.items.map((u) => u.id)).toEqual([18]);
    expect(construirListaUsuarios(usuarios, familias, { limit: 5000 }).limit).toBe(100);
  });
});

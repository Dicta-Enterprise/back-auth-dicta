// Identificadores legibles que se muestran en el panel de administración.
// No se guardan en la base: se arman a partir del tipo y del id numérico, que sigue siendo la clave real.
//   USR-P-014 → padre, USR-N-032 → niño, USR-J-009 → joven, FAM-014 → familia.

export type TipoUsuario = 'P' | 'N' | 'J';

const RELLENO = 3;

const pad = (id: number): string => String(id).padStart(RELLENO, '0');

export function formatearIdUsuario(tipo: TipoUsuario, id: number): string {
  return `USR-${tipo}-${pad(id)}`;
}

export function formatearIdFamilia(id: number): string {
  return `FAM-${pad(id)}`;
}

export type IdBuscado =
  | { clase: 'USUARIO'; id: number; tipo?: TipoUsuario }
  | { clase: 'FAMILIA'; id: number };

/**
 * Interpreta lo que escribe el administrador en el filtro de ID.
 * Acepta "USR-N-032", "usr-n-32", "FAM-014", "fam14" o solo el número ("32", que se toma como usuario).
 * Devuelve null si no tiene forma de ID.
 */
export function interpretarId(texto: string | undefined | null): IdBuscado | null {
  if (!texto) return null;
  const limpio = texto.trim().toUpperCase().replace(/\s+/g, '');
  if (!limpio) return null;

  const usuario = /^USR-?([PNJ])-?(\d+)$/.exec(limpio);
  if (usuario) {
    return { clase: 'USUARIO', tipo: usuario[1] as TipoUsuario, id: Number(usuario[2]) };
  }

  const familia = /^FAM-?(\d+)$/.exec(limpio);
  if (familia) {
    return { clase: 'FAMILIA', id: Number(familia[1]) };
  }

  if (/^\d+$/.test(limpio)) {
    return { clase: 'USUARIO', id: Number(limpio) };
  }

  return null;
}

export interface MiembroFamilia {
  idcuenta: number;
  idusuario: number;
  // ID público (UUID) del miembro.
  uuid: string;
  // Código legible del miembro: USR-N-020 (niño) o USR-J-021 (joven).
  codigo: string;
  alias: string | null;
  tipocuenta: string;
  estado: string;
}

export interface FamiliaConMiembros {
  id: number;
  // ID público (UUID) de la familia.
  uuid: string;
  // Código legible de la familia: FAM-001.
  codigo: string;
  nombre: string | null;
  padre: {
    id: number;
    // ID público (UUID) del padre.
    uuid: string;
    // Código legible del padre: USR-P-018.
    codigo: string;
    username: string;
    email: string;
  };
  miembros: MiembroFamilia[];
}

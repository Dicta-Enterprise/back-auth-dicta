export interface MiembroFamilia {
  idcuenta: number;
  idusuario: number;
  // Código legible del miembro: USR-N-020 (niño) o USR-J-021 (joven).
  codigo: string;
  alias: string | null;
  tipocuenta: string;
  estado: string;
}

export interface FamiliaConMiembros {
  id: number;
  // Código legible de la familia: FAM-001.
  codigo: string;
  nombre: string | null;
  padre: {
    id: number;
    // Código legible del padre: USR-P-018.
    codigo: string;
    username: string;
    email: string;
  };
  miembros: MiembroFamilia[];
}

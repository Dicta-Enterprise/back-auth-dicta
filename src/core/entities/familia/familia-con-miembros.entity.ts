export interface MiembroFamilia {
  idcuenta: number;
  idusuario: number;
  alias: string | null;
  tipocuenta: string;
  estado: string;
}

export interface FamiliaConMiembros {
  id: number;
  nombre: string | null;
  padre: {
    id: number;
    username: string;
    email: string;
  };
  miembros: MiembroFamilia[];
}

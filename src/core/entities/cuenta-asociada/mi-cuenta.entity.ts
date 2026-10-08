export interface PermisosCuentaAsociada {
  puedeVerCursos: boolean;
  puedeComprarCursos: boolean;
  puedeVerProgreso: boolean;
  puedeUsarChat: boolean;
  puedeDescargarMaterial: boolean;
  puedeVerCertificados: boolean;
}

export interface DatosCuentaAsociada {
  id: number;
  idpadre: number;
  tipocuenta: string;
  estado: string;
  permisos: PermisosCuentaAsociada | null;
}

export class MiCuenta {
  constructor(
    public readonly idusuario: number,
    public readonly nombre: string,
    public readonly cuentaAsociada: DatosCuentaAsociada | null,
  ) {}

  static fromPrisma(data: unknown): MiCuenta {
    const u = data as {
      id: number;
      username: string;
      cuenta_asociada: {
        id: number;
        idpadre: number;
        tipocuenta: string;
        estado: string;
        alias: string | null;
        invitacion: { nombre: string } | null;
        permisoCuenta: PermisosCuentaAsociada | null;
      }[];
    };

    const cuenta = u.cuenta_asociada[0];

    if (!cuenta) {
      return new MiCuenta(u.id, u.username, null);
    }

    const nombre = cuenta.invitacion?.nombre ?? cuenta.alias ?? u.username;

    return new MiCuenta(u.id, nombre, {
      id: cuenta.id,
      idpadre: cuenta.idpadre,
      tipocuenta: cuenta.tipocuenta,
      estado: cuenta.estado,
      permisos: cuenta.permisoCuenta ?? null,
    });
  }
}

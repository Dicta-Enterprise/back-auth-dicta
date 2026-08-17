export class InvitacionCurso {
  constructor(
    public readonly id: string,
    public readonly idCuentaAsociada: number,
    public readonly correo: string,
    public readonly token: string,
    public readonly estado: string,
    public readonly cursoId: string,
    public readonly fechaExpiracion: Date,
    public readonly fechaAceptacion: Date | null,
    public readonly fechaCreacion: Date,
    public readonly cuentaAsociada?: {
      id: number;
      idpadre: number;
      alias: string | null;
      tipocuenta: string;
    },
  ) {}

  static fromPrisma(data: unknown): InvitacionCurso {
    const i = data as {
      id: string;
      idCuentaAsociada: number;
      correo: string;
      token: string;
      estado: string;
      cursoId: string;
      fechaExpiracion: Date;
      fechaAceptacion: Date | null;
      fechaCreacion: Date;
      cuentaAsociada?: {
        id: number;
        idpadre: number;
        alias: string | null;
        tipocuenta: string;
      };
    };
    return new InvitacionCurso(
      i.id,
      i.idCuentaAsociada,
      i.correo,
      i.token,
      i.estado,
      i.cursoId,
      i.fechaExpiracion,
      i.fechaAceptacion,
      i.fechaCreacion,
      i.cuentaAsociada,
    );
  }
}

export class CuentaAsociada {
  constructor(
    public readonly id: number,
    public readonly idpadre: number,
    public readonly idusuario: number,
    public readonly tipocuenta: string,
    public readonly alias: string | null,
    public readonly estado: string,
    public readonly fechacreacion: Date,
    public readonly usuario?: {
      id: number;
      username: string;
      email: string;
    },
  ) {}

  static fromPrisma(data: unknown): CuentaAsociada {
    const c = data as {
      id: number;
      idpadre: number;
      idusuario: number;
      tipocuenta: string;
      alias: string | null;
      estado: string;
      fechacreacion: Date;
      usuarios?: {
        id: number;
        username: string;
        email: string;
      };
    };

    return new CuentaAsociada(
      c.id,
      c.idpadre,
      c.idusuario,
      c.tipocuenta,
      c.alias,
      c.estado,
      c.fechacreacion,
      c.usuarios,
    );
  }
}
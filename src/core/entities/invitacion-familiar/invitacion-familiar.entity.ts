export class InvitacionFamiliar {
  constructor(
    public readonly id: number,
    public readonly idpadre: number,
    public readonly correo: string,
    public readonly nombre: string,
    public readonly alias: string,
    public readonly fechanacimiento: Date,
    public readonly tipocuenta: string,
    public readonly token: string,
    public readonly estado: string,
    public readonly fechaexpiracion: Date,
    public readonly fechacreacion: Date,
  ) {}

  static fromPrisma(data: unknown): InvitacionFamiliar {
    const i = data as {
      id: number;
      idpadre: number;
      correo: string;
      nombre: string;
      alias: string;
      fechanacimiento: Date;
      tipocuenta: string;
      token: string;
      estado: string;
      fechaexpiracion: Date;
      fechacreacion: Date;
    };
    return new InvitacionFamiliar(
      i.id,
      i.idpadre,
      i.correo,
      i.nombre,
      i.alias,
      i.fechanacimiento,
      i.tipocuenta,
      i.token,
      i.estado,
      i.fechaexpiracion,
      i.fechacreacion,
    );
  }
}


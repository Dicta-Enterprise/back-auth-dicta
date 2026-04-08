export class DetallePermiso {
  constructor(
    public readonly id: number,
    public readonly idRol: number,
    public readonly idPermiso: number,
    public readonly estado: number,
    public readonly fechaCreacion: Date,
  ) {}

  static fromPrisma(data: any): DetallePermiso {
    return new DetallePermiso(
      data.id,
      data.idrol,
      data.idpermiso,
      data.estado,
      data.fechacreacion,
    );
  }
}
export class Permiso {
  constructor(
    public readonly id: number,
    public readonly codigo: string,
    public readonly nombre: string,
    public readonly descripcion?: string,
    public readonly estado?: number,
  ) {}

  static fromPrisma(data: any): Permiso {
    return new Permiso(
      data.id,
      data.codigo,
      data.nombre,
      data.descripcion,
      data.estado ?? 1,
    );
  }
}
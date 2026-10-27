export class Familia {
  constructor(
    public readonly id: number,
    public readonly idpadre: number,
    public readonly nombre: string | null,
    public readonly fechacreacion: Date,
  ) {}

  static fromPrisma(data: unknown): Familia {
    const f = data as {
      id: number;
      idpadre: number;
      nombre: string | null;
      fechacreacion: Date;
    };

    return new Familia(f.id, f.idpadre, f.nombre, f.fechacreacion);
  }
}

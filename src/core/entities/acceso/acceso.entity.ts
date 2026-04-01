export class Acceso {
  constructor(
    public readonly id: number,
    public readonly codigo: string,
    public readonly estado: number,
    public readonly descripcion?: string,
  ) {}

  static fromPrisma(data: unknown): Acceso {
    const a = data as {
      id: number;
      codigo: string;
      estado: number;
      descripcion?: string;
    };

    return new Acceso(
      a.id,
      a.codigo,
      a.estado,
      a.descripcion,
    );
  }
}
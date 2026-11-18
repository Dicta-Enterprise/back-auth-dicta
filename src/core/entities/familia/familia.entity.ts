// FREE hasta que el padre tenga una compra COMPLETADA; entonces PREMIUM.
export type TipoUsuarioFamilia = 'FREE' | 'PREMIUM';

export class Familia {
  constructor(
    public readonly id: number,
    public readonly idpadre: number,
    public readonly nombre: string | null,
    public readonly fechacreacion: Date,
    public readonly tipoUsuario: TipoUsuarioFamilia = 'FREE',
  ) {}

  static fromPrisma(data: unknown): Familia {
    const f = data as {
      id: number;
      idpadre: number;
      nombre: string | null;
      fechacreacion: Date;
      tipo_usuario?: string;
    };

    return new Familia(f.id, f.idpadre, f.nombre, f.fechacreacion, f.tipo_usuario === 'PREMIUM' ? 'PREMIUM' : 'FREE');
  }
}

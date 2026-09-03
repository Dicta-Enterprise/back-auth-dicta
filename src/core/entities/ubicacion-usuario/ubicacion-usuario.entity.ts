export class UbicacionUsuario {
  constructor(
    public readonly id: number,
    public readonly idusuario: number,
    public readonly idpais: number | null,
    public readonly ciudad: string | null,
    public readonly zonaHoraria: string | null,
    public readonly fechaActualizacion: Date,
    public readonly pais?: { id: number; nombre: string } | null,
  ) {}

  static fromPrisma(data: unknown): UbicacionUsuario {
    const u = data as {
      id: number;
      idusuario: number;
      idpais: number | null;
      ciudad: string | null;
      zonaHoraria: string | null;
      fechaActualizacion: Date;
      pais?: { id: number; nombre: string } | null;
    };

    return new UbicacionUsuario(
      u.id,
      u.idusuario,
      u.idpais,
      u.ciudad,
      u.zonaHoraria,
      u.fechaActualizacion,
      u.pais,
    );
  }
}

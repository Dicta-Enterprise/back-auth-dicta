export class CursoAsignado {
  constructor(
    public readonly id: number,
    public readonly idcuentaasociada: number,
    public readonly idcurso: string,
    public readonly fechaasignacion: Date,
    public readonly estado: string,
  ) {}

  static fromPrisma(data: unknown): CursoAsignado {
    const c = data as {
      id: number;
      idcuentaasociada: number;
      idcurso: string;
      fechaasignacion: Date;
      estado: string;
    };
    return new CursoAsignado(
      c.id,
      c.idcuentaasociada,
      c.idcurso,
      c.fechaasignacion,
      c.estado,
    );
  }
}


export class Rol {
  constructor(
    public readonly id: number,
    public readonly nombreRol: string,
    public readonly estado: number,
    public readonly descripcion?: string,
    public readonly tipo?: string,
  ) {}

  static fromPrisma(data: unknown): Rol {
    const r = data as {
      id: number;
      nombrerol: string;
      estado: number;
      descripcion?: string;
      tipo?: string;
    };

    return new Rol(
      r.id,           
      r.nombrerol,    
      r.estado,       
      r.descripcion,
      r.tipo,         
    );
  }
}
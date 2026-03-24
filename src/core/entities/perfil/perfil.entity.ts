export class Perfil {
  constructor(
    public readonly id: number,
    public readonly nombre: string,
    public readonly password: string,
    public readonly idusuario: number,
    public readonly idrol: number,
    public readonly estado: number,
    public readonly imageurl?: string,
  ) {}

  static fromPrisma(data: unknown): Perfil {
    const p = data as {
      id: number;
      nombre: string;
      password: string;
      idusuario: number;
      idrol: number;
      estado: number;
      imageurl?: string;
    };

    return new Perfil(
      p.id,
      p.nombre,
      p.password,
      p.idusuario,
      p.idrol,
      p.estado,
      p.imageurl,
    );
  }
}
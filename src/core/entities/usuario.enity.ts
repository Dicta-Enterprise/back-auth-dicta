export class Usuario{
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public password: string,
    public estado: number,
    public fechadecreacion: Date
  ){}

  static fromPrisma(data: unknown): Usuario {
    const u = data as {
      id: string;
      username: string;
      email: string;
      password: string;
      estado: number;
      fechadecreacion: Date;
    };

    return new Usuario(
      u.id,
      u.username,
      u.email,
      u.password,
      u.estado,
      u.fechadecreacion,
    );
  }
}
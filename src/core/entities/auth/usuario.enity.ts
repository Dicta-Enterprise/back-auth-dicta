export class Usuario{
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public password: string | null,
    public estado: number,
    public fechadecreacion: Date,
    public authProvider: string = 'LOCAL'
  ){}

  static fromPrisma(data: unknown): Usuario {
    const u = data as {
      id: string;
      username: string;
      email: string;
      password: string | null;
      estado: number;
      fechadecreacion: Date;
      authProvider: string
    };

    return new Usuario(
      u.id,
      u.username,
      u.email,
      u.password,
      u.estado,
      u.fechadecreacion,
      u.authProvider
    );
  }
}
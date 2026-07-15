export class Usuario {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public password: string | null,
    public estado: number,
    public fechadecreacion: Date,
    public authProvider: string = 'LOCAL',
    public googleId?: string,
    public idrol?: number,
    public acceptTerms: boolean = false,
    public resetCode?: string | null,
    public resetCodeExpires?: Date | null,
    public resetAttempts?: number,
    public verifyCode?: string | null,
    public verifyCodeExpires?: Date | null,
    public verifyAttempts?: number, 
  ) {}

  static fromPrisma(data: unknown): Usuario {
    const u = data as {
      id: string;
      username: string;
      email: string;
      password: string | null;
      estado: number;
      fechadecreacion: Date;
      authProvider: string;
      googleId?: string;
      idrol?: number;
      terminos_condiciones: boolean;
      reset_code?: string | null;
      reset_code_expires?: Date | null;
      reset_attempts?: number;
      verify_code?: string | null;
      verify_code_expires?: Date | null;
      verify_attempts?: number;
    };

    return new Usuario(
      u.id,
      u.username,
      u.email,
      u.password,
      u.estado,
      u.fechadecreacion,
      u.authProvider,
      u.googleId,
      u.idrol,
      u.terminos_condiciones,
      u.reset_code,
      u.reset_code_expires,
      u.reset_attempts,
      u.verify_code,
      u.verify_code_expires,
      u.verify_attempts,
    );
  }
}
import { Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/core/services/usuarios/usuarios.service';
import { GoogleLoginDto } from '../dto/google-login.dto';
import { Result } from 'src/shared/domain/result/result';
import { AuthService } from 'src/core/services/auth/auth.service';

@Injectable()
export class GoogleUseCase {
  constructor(
    private readonly usuarioService: UsuariosService,
    private readonly authService: AuthService,
  ) {}

  async execute(dto: GoogleLoginDto): Promise<Result<string>> {
    try {
      const usuario = await this.usuarioService.crearUsuarioGoogle(dto);
      const accessToken = this.authService.generateAccessToken({
        id: usuario.id,
        email: usuario.email,
      });

      return Result.ok(accessToken);
    } catch (error) {
      return Result.fail(error);
    }
  }
}

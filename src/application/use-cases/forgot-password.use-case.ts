import { Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/core/services/usuarios/usuarios.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(private readonly usuarioService: UsuariosService) {}

  async execute(dto: ForgotPasswordDto): Promise<Result<void>> {
    try {
      await this.usuarioService.solicitarResetCodigo(dto.email);
      return Result.ok(undefined);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al solicitar el reseteo de contraseña.'));
    }  
  }
}
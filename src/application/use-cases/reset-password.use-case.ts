import { Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/core/services/usuarios/usuarios.service';
import { Result } from 'src/shared/domain/result/result';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Injectable()
export class ResetPasswordUseCase {
  constructor(private readonly usuarioService: UsuariosService) {}

  async execute(dto: ResetPasswordDto): Promise<Result<void>> {
    try {
      await this.usuarioService.resetPassword(dto);
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
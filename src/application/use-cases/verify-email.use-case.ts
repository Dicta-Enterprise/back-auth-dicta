import { Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/core/services/usuarios/usuarios.service';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class VerifyEmailUseCase {
  constructor(private readonly usuarioService: UsuariosService) {}

  async execute(dto: VerifyEmailDto): Promise<Result<void>> {
    try {
      await this.usuarioService.verificarEmail(dto.email, dto.code);
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
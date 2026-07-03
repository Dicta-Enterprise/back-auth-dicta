import { Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/core/services/usuarios/usuarios.service';
import { Result } from 'src/shared/domain/result/result';
import { VerifyResetCodeDto } from '../dto/verify-reset-code.dto';

@Injectable()
export class VerifyResetCodeUseCase {
  constructor(private readonly usuarioService: UsuariosService) {}

  async execute(dto: VerifyResetCodeDto): Promise<Result<void>> {
    try {
      await this.usuarioService.verificarResetCodigo(dto.email, dto.code);
      return Result.ok(undefined);
    } catch {

      return Result.fail(new Error('Ocurrió un error desconocido al verificar el código.'));
    }
  }
}
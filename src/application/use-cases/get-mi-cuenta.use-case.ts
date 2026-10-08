import { Injectable } from '@nestjs/common';
import { CuentaAsociadaService } from 'src/core/services/cuenta-asociada/cuenta-asociada.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetMiCuentaUseCase {
  constructor(private readonly service: CuentaAsociadaService) {}

  async execute(idusuario: number) {
    try {
      const miCuenta = await this.service.obtenerMiCuenta(idusuario);
      if (!miCuenta) {
        return Result.fail(new Error('Usuario no encontrado.'));
      }
      return Result.ok(miCuenta);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al obtener la cuenta del usuario.'));
    }
  }
}

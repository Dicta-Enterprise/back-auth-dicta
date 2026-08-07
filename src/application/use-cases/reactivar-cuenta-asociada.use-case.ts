import { Injectable } from '@nestjs/common';
import { CuentaAsociadaService } from 'src/core/services/cuenta-asociada/cuenta-asociada.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class ReactivarCuentaAsociadaUseCase {
  constructor(private readonly service: CuentaAsociadaService) {}

  async execute(id: number, idpadre: number) {
    try {
      const cuenta = await this.service.obtenerCuentaPorIdYPadre(id, idpadre);
      if (!cuenta) {
        return Result.fail(new Error('Cuenta asociada no encontrada o no autorizada.'));
      }
      const actualizada = await this.service.cambiarEstado(id, 'ACTIVA');
      return Result.ok(actualizada);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al reactivar la cuenta asociada.'));
    }
  }
}


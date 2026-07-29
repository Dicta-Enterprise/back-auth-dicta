import { Injectable } from '@nestjs/common';
import { CuentaAsociadaService } from 'src/core/services/cuenta-asociada/cuenta-asociada.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class DeleteCuentaFamiliarUseCase {
  constructor(private readonly service: CuentaAsociadaService) {}

  async execute(id: number, idpadre: number) {
    try {
      const cuenta = await this.service.obtenerCuentaPorIdYPadre(id, idpadre);
      if (!cuenta) {
        return Result.fail(new Error('Cuenta familiar no encontrada o no autorizada.'));
      }

      const eliminada = await this.service.eliminarRelacion(id);
      return Result.ok(eliminada);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al eliminar la cuenta familiar.'));
    }
  }
}
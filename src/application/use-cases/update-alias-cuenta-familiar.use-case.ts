import { Injectable } from '@nestjs/common';
import { UpdateAliasCuentaAsociadaDto } from 'src/application/dto/update-alias-cuenta-asociada.dto';
import { CuentaAsociadaService } from 'src/core/services/cuenta-asociada/cuenta-asociada.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class UpdateAliasCuentaFamiliarUseCase {
  constructor(private readonly service: CuentaAsociadaService) {}

  async execute(id: number, idpadre: number, dto: UpdateAliasCuentaAsociadaDto) {
    try {
      const cuenta = await this.service.obtenerCuentaPorIdYPadre(id, idpadre);
      if (!cuenta) {
        return Result.fail(new Error('Cuenta familiar no encontrada o no autorizada.'));
      }

      if (cuenta.estado !== 'PENDIENTE') {
        return Result.fail(new Error(`No se puede modificar la cuenta porque su estado actual es ${cuenta.estado}.`));
      }

      const actualizada = await this.service.actualizarAlias(id, dto.alias);
      return Result.ok(actualizada);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al actualizar el alias de la cuenta familiar.'));
    }
  }
}


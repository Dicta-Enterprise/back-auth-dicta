import { Injectable } from '@nestjs/common';
import { CuentaAsociadaService } from 'src/core/services/cuenta-asociada/cuenta-asociada.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetCuentasFamiliaresUseCase {
  constructor(private readonly service: CuentaAsociadaService) {}

  async execute(idpadre: number) {
    try {
      const cuentas = await this.service.obtenerCuentasPorPadre(idpadre);
      return Result.ok(cuentas);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al obtener las cuentas familiares.'));
    }
  }
}
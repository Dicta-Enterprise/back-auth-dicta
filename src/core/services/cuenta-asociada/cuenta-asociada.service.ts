import { Inject, Injectable } from '@nestjs/common';
import { CUENTA_ASOCIADA_REPOSITORY } from 'src/core/constants/constants';
import { CuentaAsociada } from 'src/core/entities/cuenta-asociada/cuenta-asociada.entity';
import { CuentaAsociadaRepository } from 'src/core/repositories/cuenta-asociada.repository';

@Injectable()
export class CuentaAsociadaService {
  constructor(
    @Inject(CUENTA_ASOCIADA_REPOSITORY)
    private readonly repository: CuentaAsociadaRepository,
  ) {}

  async obtenerCuentasPorPadre(idpadre: number): Promise<CuentaAsociada[]> {
    return this.repository.findCuentasByPadre(idpadre);
  }

  async obtenerCuentaPorIdYPadre(id: number, idpadre: number): Promise<CuentaAsociada | null> {
    return this.repository.findCuentaByIdAndPadre(id, idpadre);
  }

  async actualizarAlias(id: number, alias: string): Promise<CuentaAsociada> {
    return this.repository.updateAlias(id, alias);
  }

  async eliminarRelacion(id: number): Promise<CuentaAsociada> {
    return this.repository.deleteRelacion(id);
  }
}
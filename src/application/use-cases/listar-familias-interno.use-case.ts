import { Injectable } from '@nestjs/common';
import { FamiliaService } from 'src/core/services/familia/familia.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class ListarFamiliasInternoUseCase {
  constructor(private readonly familiaService: FamiliaService) {}

  async execute() {
    try {
      return Result.ok(await this.familiaService.listarConMiembros());
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al listar las familias.'));
    }
  }
}

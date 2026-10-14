import { Injectable } from '@nestjs/common';
import { FamiliaService } from 'src/core/services/familia/familia.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetFamiliaInternoUseCase {
  constructor(private readonly familiaService: FamiliaService) {}

  async execute(idpadre: number) {
    try {
      const familia = await this.familiaService.obtenerConMiembrosPorPadre(idpadre);
      if (!familia) {
        return Result.fail(new Error('Ese usuario aún no tiene una familia creada.'));
      }
      return Result.ok(familia);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al obtener la familia.'));
    }
  }
}

import { Injectable } from '@nestjs/common';
import { FamiliaService } from 'src/core/services/familia/familia.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetMiFamiliaUseCase {
  constructor(private readonly familiaService: FamiliaService) {}

  async execute(idpadre: number) {
    try {
      const familia = await this.familiaService.obtenerPorPadre(idpadre);
      if (!familia) {
        return Result.fail(new Error('Aún no tienes una familia creada.'));
      }

      return Result.ok({
        id: familia.id,
        nombre: familia.nombre,
        fechacreacion: familia.fechacreacion,
      });
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al obtener la familia.'));
    }
  }
}

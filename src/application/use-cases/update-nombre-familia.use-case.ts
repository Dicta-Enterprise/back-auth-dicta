import { Injectable } from '@nestjs/common';
import { FamiliaService } from 'src/core/services/familia/familia.service';
import { Result } from 'src/shared/domain/result/result';
import { UpdateNombreFamiliaDto } from '../dto/update-nombre-familia.dto';

@Injectable()
export class UpdateNombreFamiliaUseCase {
  constructor(private readonly familiaService: FamiliaService) {}

  async execute(idpadre: number, dto: UpdateNombreFamiliaDto) {
    try {
      const familia = await this.familiaService.obtenerPorPadre(idpadre);
      if (!familia) {
        return Result.fail(new Error('Aún no tienes una familia creada.'));
      }

      const actualizada = await this.familiaService.actualizarNombre(idpadre, dto.nombre);

      return Result.ok({
        id: actualizada.id,
        nombre: actualizada.nombre,
        fechacreacion: actualizada.fechacreacion,
      });
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al actualizar el nombre de la familia.'));
    }
  }
}

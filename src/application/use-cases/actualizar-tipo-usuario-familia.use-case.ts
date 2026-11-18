import { Injectable } from '@nestjs/common';
import { Familia, TipoUsuarioFamilia } from 'src/core/entities/familia/familia.entity';
import { FamiliaService } from 'src/core/services/familia/familia.service';
import { Result } from 'src/shared/domain/result/result';

// back-transaction lo llama cuando cambia el estado de una orden: sube la familia a PREMIUM con la primera compra
// completada y la devuelve a FREE si ya no le queda ninguna. Aquí solo se guarda lo que ese servicio decidió.
@Injectable()
export class ActualizarTipoUsuarioFamiliaUseCase {
  constructor(private readonly familiaService: FamiliaService) {}

  async execute(idpadre: number, tipoUsuario: TipoUsuarioFamilia): Promise<Result<Familia>> {
    try {
      const familia = await this.familiaService.actualizarTipoUsuario(idpadre, tipoUsuario);
      if (!familia) {
        return Result.fail<Familia>(new Error('Ese usuario aún no tiene una familia creada.'));
      }
      return Result.ok(familia);
    } catch {
      return Result.fail<Familia>(new Error('Ocurrió un error desconocido al actualizar el tipo de usuario.'));
    }
  }
}

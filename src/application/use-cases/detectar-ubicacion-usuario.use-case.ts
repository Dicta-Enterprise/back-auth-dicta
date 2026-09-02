import { Injectable } from '@nestjs/common';
import { UbicacionUsuario } from 'src/core/entities/ubicacion-usuario/ubicacion-usuario.entity';
import { UbicacionUsuarioService } from 'src/core/services/ubicacion-usuario/ubicacion-usuario.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class DetectarUbicacionUsuarioUseCase {
  constructor(private readonly ubicacionUsuarioService: UbicacionUsuarioService) {}

  async execute(idusuario: number, ip: string | null): Promise<Result<UbicacionUsuario>> {
    try {
      const ubicacion = await this.ubicacionUsuarioService.detectarYActualizar(idusuario, ip);
      return Result.ok<UbicacionUsuario>(ubicacion);
    } catch (error) {
      return Result.fail(error);
    }
  }
}

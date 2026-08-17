import { Injectable } from '@nestjs/common';
import { CursoAsignadoService } from 'src/core/services/curso-asignado/curso-asignado.service';
import { ReasignarCursoDto } from '../dto/reasignar-curso.dto';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class ReasignarCursoAsignadoUseCase {
  constructor(private readonly service: CursoAsignadoService) {}

  async execute(id: number, dto: ReasignarCursoDto) {
    try {
      const curso = await this.service.buscarPorId(id);
      if (!curso) {
        return Result.fail(new Error('Curso asignado no encontrado.'));
      }

      const yaExiste = await this.service.buscarPorCuentaYCurso(dto.idcuentaasociada, curso.idcurso);
      if (yaExiste) {
        return Result.fail(new Error('La cuenta destino ya tiene este curso asignado.'));
      }

      const actualizado = await this.service.reasignar(id, dto.idcuentaasociada);
      return Result.ok(actualizado);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al reasignar el curso.'));
    }
  }
}



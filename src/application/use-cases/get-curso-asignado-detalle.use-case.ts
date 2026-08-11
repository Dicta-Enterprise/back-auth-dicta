import { Injectable } from '@nestjs/common';
import { CursoAsignadoService } from 'src/core/services/curso-asignado/curso-asignado.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetCursoAsignadoDetalleUseCase {
  constructor(private readonly service: CursoAsignadoService) {}

  async execute(id: number) {
    try {
      const curso = await this.service.buscarPorId(id);
      if (!curso) {
        return Result.fail(new Error('Curso asignado no encontrado.'));
      }
      return Result.ok(curso);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al obtener el curso asignado.'));
    }
  }
}


import { Injectable } from '@nestjs/common';
import { CursoAsignadoService } from 'src/core/services/curso-asignado/curso-asignado.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class DeleteCursoAsignadoUseCase {
  constructor(private readonly service: CursoAsignadoService) {}

  async execute(id: number) {
    try {
      const curso = await this.service.buscarPorId(id);
      if (!curso) {
        return Result.fail(new Error('Curso asignado no encontrado.'));
      }
      const eliminado = await this.service.eliminar(id);
      return Result.ok(eliminado);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al eliminar el curso asignado.'));
    }
  }
}


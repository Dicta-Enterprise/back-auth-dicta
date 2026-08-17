import { Injectable } from '@nestjs/common';
import { CursoAsignadoService } from 'src/core/services/curso-asignado/curso-asignado.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetCursosPorCuentaUseCase {
  constructor(private readonly service: CursoAsignadoService) {}

  async execute(idcuentaasociada: number) {
    try {
      const cursos = await this.service.listarPorCuenta(idcuentaasociada);
      return Result.ok(cursos);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al obtener los cursos.'));
    }
  }
}




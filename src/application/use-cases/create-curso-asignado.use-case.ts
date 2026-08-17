import { Injectable } from '@nestjs/common';
import { CursoAsignadoService } from 'src/core/services/curso-asignado/curso-asignado.service';
import { CreateCursoAsignadoDto } from '../dto/create-curso-asignado.dto';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class CreateCursoAsignadoUseCase {
  constructor(private readonly service: CursoAsignadoService) {}

  async execute(dto: CreateCursoAsignadoDto) {
    try {
      const existente = await this.service.buscarPorCuentaYCurso(dto.idcuentaasociada, dto.idcurso);
      if (existente) {
        return Result.fail(new Error('Este curso ya está asignado a esta cuenta asociada.'));
      }

      const creado = await this.service.crear(dto.idcuentaasociada, dto.idcurso);
      return Result.ok(creado);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al asignar el curso.'));
    }
  }
}


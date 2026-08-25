import { Injectable } from '@nestjs/common';
import { CursoAsignadoService } from 'src/core/services/curso-asignado/curso-asignado.service';
import { CuentaAsociadaService } from 'src/core/services/cuenta-asociada/cuenta-asociada.service';
import { CreateCursoAsignadoDto } from '../dto/create-curso-asignado.dto';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class CreateCursoAsignadoUseCase {
  constructor(
    private readonly service: CursoAsignadoService,
    private readonly cuentaAsociadaService: CuentaAsociadaService,
  ) {}

  async execute(dto: CreateCursoAsignadoDto, idpadre: number) {
    try {
      const cuenta = await this.cuentaAsociadaService.obtenerCuentaPorIdYPadre(dto.idcuentaasociada, idpadre);
      if (!cuenta) {
        return Result.fail(new Error('Cuenta asociada no encontrada o no autorizada.'));
      }

      if (cuenta.estado !== 'ACTIVA') {
        return Result.fail(new Error(`La cuenta asociada no puede recibir cursos porque su estado actual es ${cuenta.estado}.`));
      }

      if (cuenta.tipocuenta !== dto.tipoCurso) {
        return Result.fail(new Error(`El curso es de tipo ${dto.tipoCurso} y no puede asignarse a una cuenta de tipo ${cuenta.tipocuenta}.`));
      }

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


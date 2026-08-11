import { Inject, Injectable } from '@nestjs/common';
import { CURSO_ASIGNADO_REPOSITORY } from 'src/core/constants/constants';
import { CursoAsignado } from 'src/core/entities/curso-asignado/curso-asignado.entity';
import { CursoAsignadoRepository } from 'src/core/repositories/curso-asignado.repository';

@Injectable()
export class CursoAsignadoService {
  constructor(
    @Inject(CURSO_ASIGNADO_REPOSITORY)
    private readonly repository: CursoAsignadoRepository,
  ) {}

  async crear(idcuentaasociada: number, idcurso: string): Promise<CursoAsignado> {
    return this.repository.create({ idcuentaasociada, idcurso });
  }

  async buscarPorCuentaYCurso(idcuentaasociada: number, idcurso: string): Promise<CursoAsignado | null> {
    return this.repository.findByCuentaAndCurso(idcuentaasociada, idcurso);
  }

  async listarPorCuenta(idcuentaasociada: number): Promise<CursoAsignado[]> {
    return this.repository.findByCuenta(idcuentaasociada);
  }

  async buscarPorId(id: number): Promise<CursoAsignado | null> {
    return this.repository.findById(id);
  }

  async reasignar(id: number, idcuentaasociada: number): Promise<CursoAsignado> {
    return this.repository.reasignar(id, idcuentaasociada);
  }

  async eliminar(id: number): Promise<CursoAsignado> {
    return this.repository.delete(id);
  }
}
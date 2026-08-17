import { CursoAsignado } from '../entities/curso-asignado/curso-asignado.entity';

export interface CursoAsignadoRepository {
  create(data: { idcuentaasociada: number; idcurso: string }): Promise<CursoAsignado>;
  findByCuentaAndCurso(idcuentaasociada: number, idcurso: string): Promise<CursoAsignado | null>;
  findByCuenta(idcuentaasociada: number): Promise<CursoAsignado[]>;
  findById(id: number): Promise<CursoAsignado | null>;
  reasignar(id: number, idcuentaasociada: number): Promise<CursoAsignado>;
  delete(id: number): Promise<CursoAsignado>;
}


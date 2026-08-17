import { CuentaAsociada } from '../entities/cuenta-asociada/cuenta-asociada.entity';

export interface CuentaAsociadaRepository {
  findCuentasByPadre(idpadre: number): Promise<CuentaAsociada[]>;
  updateEstado(id: number, estado: 'ACTIVA' | 'INACTIVA'): Promise<CuentaAsociada>;
  findCuentaByIdAndPadre(id: number, idpadre: number): Promise<CuentaAsociada | null>;
  updateAlias(id: number, alias: string): Promise<CuentaAsociada>;
  deleteRelacion(id: number): Promise<CuentaAsociada>;
  asociarUsuario(id: number, idusuario: number): Promise<CuentaAsociada>;
}
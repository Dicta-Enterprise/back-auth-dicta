import { DetallePermiso } from '../entities/detalle-permiso/detalle-permiso.entity';

export interface DetallePermisoRepository {
  create(idRol: number, idPermiso: number): Promise<DetallePermiso>;
  findByIds(idRol: number, idPermiso: number): Promise<DetallePermiso | null>;
  findPermisosByRolId(idRol: number): Promise<any[]>;
  delete(idRol: number, idPermiso: number): Promise<void>;
  deleteAllByRolId(idRol: number): Promise<void>;
}
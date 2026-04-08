import { Permiso } from '../entities/permiso/permiso.entity';

export interface PermisoRepository {
  create(permiso: Permiso): Promise<Permiso>;
  findAll(): Promise<Permiso[]>;
  findById(id: number): Promise<Permiso | null>;
  findByCodigo(codigo: string): Promise<Permiso | null>;
}
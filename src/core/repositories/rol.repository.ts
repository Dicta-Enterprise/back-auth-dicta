import { Rol } from '../entities/rol/rol.entity';

export interface RolRepository {
  create(rol: Rol): Promise<Rol>;
  findById(id: number): Promise<Rol | null>;
  findByNombre(nombre: string): Promise<Rol | null>;
  findAll(): Promise<Rol[]>;
  existsById(id: number): Promise<boolean>;
}
import { Perfil } from '../entities/perfil/perfil.entity';

export interface PerfilRepository {
  create(perfil: Perfil): Promise<Perfil>;
  findAllByUserId(userId: number): Promise<Perfil[]>;
  findProfileById(perfilId: number, userId: number): Promise<Perfil>;
  update(perfilId: number, userId: number, updatedData: Partial<Perfil>): Promise<Perfil>;
}
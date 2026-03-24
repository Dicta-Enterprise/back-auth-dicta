import { Perfil } from '../entities/perfil/perfil.entity';

export interface PerfilRepository {
  create(perfil: Perfil): Promise<Perfil>;
  findAllByUserId(userId: number): Promise<Perfil[]>;
}
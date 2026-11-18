import { Familia, TipoUsuarioFamilia } from '../entities/familia/familia.entity';
import { FamiliaConMiembros } from '../entities/familia/familia-con-miembros.entity';

export interface FamiliaRepository {
  findByPadre(idpadre: number): Promise<Familia | null>;
  crear(idpadre: number): Promise<Familia>;
  actualizarNombre(idpadre: number, nombre: string): Promise<Familia>;
  actualizarTipoUsuario(idpadre: number, tipoUsuario: TipoUsuarioFamilia): Promise<Familia | null>;
  listarConMiembros(): Promise<FamiliaConMiembros[]>;
  findConMiembrosPorPadre(idpadre: number): Promise<FamiliaConMiembros | null>;
}

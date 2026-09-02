import { UbicacionUsuario } from '../entities/ubicacion-usuario/ubicacion-usuario.entity';

export interface UbicacionUsuarioRepository {
  findByUsuario(idusuario: number): Promise<UbicacionUsuario | null>;
  upsert(
    idusuario: number,
    data: { idpais: number | null; ciudad: string | null; zonaHoraria: string | null },
  ): Promise<UbicacionUsuario>;
  findPaisIdByNombre(nombre: string): Promise<number | null>;
}

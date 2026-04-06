import { Inject, Injectable } from '@nestjs/common';
import { DETALLE_PERMISO_REPOSITORY } from 'src/core/constants/constants';
import { DetallePermisoRepository } from 'src/core/repositories/detalle-permiso.repository';

@Injectable()
export class DetallePermisoService {
  constructor(
    @Inject(DETALLE_PERMISO_REPOSITORY)
    private detallePermisoRepository: DetallePermisoRepository,
  ) {}

  async asignarPermisosARol(idRol: number, permisosIds: number[]): Promise<{
    asignados: number[];
    existentes: number[];
    errores: number[];
  }> {
    const asignados: number[] = [];
    const existentes: number[] = [];
    const errores: number[] = [];

    for (const idPermiso of permisosIds) {
      try {
        const existe = await this.detallePermisoRepository.findByIds(idRol, idPermiso);
        if (existe) {
          existentes.push(idPermiso);
        } else {
          await this.detallePermisoRepository.create(idRol, idPermiso);
          asignados.push(idPermiso);
        }
      } catch (error) {
        errores.push(idPermiso);
      }
    }

    return { asignados, existentes, errores };
  }

  async reemplazarPermisosDeRol(idRol: number, permisosIds: number[]): Promise<void> {
    await this.detallePermisoRepository.deleteAllByRolId(idRol);
    for (const idPermiso of permisosIds) {
      await this.detallePermisoRepository.create(idRol, idPermiso);
    }
  }

  async obtenerPermisosPorRol(idRol: number): Promise<any[]> {
    return await this.detallePermisoRepository.findPermisosByRolId(idRol);
  }

  async eliminarPermisoDeRol(idRol: number, idPermiso: number): Promise<void> {
    const existe = await this.detallePermisoRepository.findByIds(idRol, idPermiso);
    if (!existe) {
      throw new Error('La relación entre rol y permiso no existe');
    }
    await this.detallePermisoRepository.delete(idRol, idPermiso);
  }
}
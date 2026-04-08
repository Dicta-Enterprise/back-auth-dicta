import { Inject, Injectable } from '@nestjs/common';
import { CreatePermisoDto } from 'src/application/dto/create-permiso.dto';
import { PERMISO_REPOSITORY } from 'src/core/constants/constants';
import { Permiso } from 'src/core/entities/permiso/permiso.entity';
import { PermisoRepository } from 'src/core/repositories/permiso.repository';

@Injectable()
export class PermisoService {
  constructor(
    @Inject(PERMISO_REPOSITORY) private permisoRepository: PermisoRepository,
  ) {}

  async crearPermiso(dto: CreatePermisoDto): Promise<Permiso> {
    const existente = await this.permisoRepository.findByCodigo(dto.codigo);
    if (existente) {
      throw new Error(`Ya existe un permiso con el código ${dto.codigo}`);
    }

    const permiso = new Permiso(null, dto.codigo, dto.nombre, dto.descripcion, 1);
    return await this.permisoRepository.create(permiso);
  }

  async obtenerTodosPermisos(): Promise<Permiso[]> {
    return await this.permisoRepository.findAll();
  }

  async obtenerPermisoPorId(id: number): Promise<Permiso | null> {
    return await this.permisoRepository.findById(id);
  }
}
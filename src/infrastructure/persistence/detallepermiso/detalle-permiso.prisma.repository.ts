import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { DetallePermiso } from 'src/core/entities/detalle-permiso/detalle-permiso.entity';
import { DetallePermisoRepository } from 'src/core/repositories/detalle-permiso.repository';

@Injectable()
export class DetallePermisoPrismaRepository implements DetallePermisoRepository {
  constructor(private prisma: PrismaService) {}

  async create(idRol: number, idPermiso: number): Promise<DetallePermiso> {
    const data = await this.prisma.detallepermisos.create({
      data: {
        idrol: idRol,
        idpermiso: idPermiso,
        estado: 1,
      },
    });
    return DetallePermiso.fromPrisma(data);
  }

  async findByIds(idRol: number, idPermiso: number): Promise<DetallePermiso | null> {
    const data = await this.prisma.detallepermisos.findUnique({
      where: {
        idrol_idpermiso: {
          idrol: idRol,
          idpermiso: idPermiso,
        },
      },
    });
    return data ? DetallePermiso.fromPrisma(data) : null;
  }

  async findPermisosByRolId(idRol: number): Promise<any[]> {
    return await this.prisma.detallepermisos.findMany({
      where: { idrol: idRol, estado: 1 },
      include: {
        permiso: true,
      },
    });
  }

  async delete(idRol: number, idPermiso: number): Promise<void> {
    await this.prisma.detallepermisos.delete({
      where: {
        idrol_idpermiso: {
          idrol: idRol,
          idpermiso: idPermiso,
        },
      },
    });
  }

  async deleteAllByRolId(idRol: number): Promise<void> {
    await this.prisma.detallepermisos.deleteMany({
      where: { idrol: idRol },
    });
  }
}
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { Permiso } from 'src/core/entities/permiso/permiso.entity';
import { PermisoRepository } from 'src/core/repositories/permiso.repository';

@Injectable()
export class PermisoPrismaRepository implements PermisoRepository {
  constructor(private prisma: PrismaService) {}

  async create(permiso: Permiso): Promise<Permiso> {
    const data = await this.prisma.permiso.create({
      data: {
        codigo: permiso.codigo,
        nombre: permiso.nombre,
        descripcion: permiso.descripcion,
        estado: permiso.estado ?? 1,
      },
    });
    return Permiso.fromPrisma(data);
  }

  async findAll(): Promise<Permiso[]> {
    const data = await this.prisma.permiso.findMany({
      orderBy: { id: 'asc' },
    });
    return data.map(p => Permiso.fromPrisma(p));
  }

  async findById(id: number): Promise<Permiso | null> {
    const data = await this.prisma.permiso.findUnique({
      where: { id },
    });
    return data ? Permiso.fromPrisma(data) : null;
  }

  async findByCodigo(codigo: string): Promise<Permiso | null> {
    const data = await this.prisma.permiso.findUnique({
      where: { codigo },
    });
    return data ? Permiso.fromPrisma(data) : null;
  }
}
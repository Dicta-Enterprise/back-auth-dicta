import { Injectable } from '@nestjs/common';
import { Rol } from 'src/core/entities/rol/rol.entity';
import { RolRepository } from 'src/core/repositories/rol.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class RolPrismaRepository implements RolRepository {
  constructor(private prisma: PrismaService) {}

  async create(rol: Rol): Promise<Rol> {
    const data = await this.prisma.rol.create({
      data: {
        id: rol.id,
        nombrerol: rol.nombreRol,  // Cambiado a 'nombrerol' (minúsculas)
        estado: rol.estado ?? 1,
        descripcion: rol.descripcion,
        tipo: rol.tipo,
      },
    });
    return Rol.fromPrisma(data);
  }

  async findById(id: number): Promise<Rol | null> {
    const data = await this.prisma.rol.findUnique({
      where: { id: id }
    });
    return data ? Rol.fromPrisma(data) : null;
  }

  async findByNombre(nombre: string): Promise<Rol | null> {
    const data = await this.prisma.rol.findFirst({
      where: { nombrerol: nombre }  // Cambiado a 'nombrerol'
    });
    return data ? Rol.fromPrisma(data) : null;
  }

  async findAll(): Promise<Rol[]> {
    const data = await this.prisma.rol.findMany({
      orderBy: { id: 'asc' }
    });
    return data.map(rol => Rol.fromPrisma(rol));
  }

  async existsById(id: number): Promise<boolean> {
    const count = await this.prisma.rol.count({
      where: { id: id }
    });
    return count > 0;
  }
}
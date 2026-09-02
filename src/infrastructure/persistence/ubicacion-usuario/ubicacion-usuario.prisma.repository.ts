import { Injectable } from '@nestjs/common';
import { UbicacionUsuario } from 'src/core/entities/ubicacion-usuario/ubicacion-usuario.entity';
import { UbicacionUsuarioRepository } from 'src/core/repositories/ubicacion-usuario.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

const PAIS_SELECT = { pais: { select: { id: true, nombre: true } } };

@Injectable()
export class UbicacionUsuarioPrismaRepository implements UbicacionUsuarioRepository {
  constructor(private prisma: PrismaService) {}

  async findByUsuario(idusuario: number): Promise<UbicacionUsuario | null> {
    const data = await this.prisma.ubicacion_usuario.findUnique({
      where: { idusuario },
      include: PAIS_SELECT,
    });
    return data ? UbicacionUsuario.fromPrisma(data) : null;
  }

  async upsert(
    idusuario: number,
    data: { idpais: number | null; ciudad: string | null; zonaHoraria: string | null },
  ): Promise<UbicacionUsuario> {
    const result = await this.prisma.ubicacion_usuario.upsert({
      where: { idusuario },
      create: { idusuario, ...data },
      update: { ...data },
      include: PAIS_SELECT,
    });
    return UbicacionUsuario.fromPrisma(result);
  }

  async findPaisIdByNombre(nombre: string): Promise<number | null> {
    const pais = await this.prisma.pais.findFirst({
      where: { nombre: { equals: nombre, mode: 'insensitive' } },
      select: { id: true },
    });
    return pais?.id ?? null;
  }
}

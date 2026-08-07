import { Injectable } from '@nestjs/common';
import { CuentaAsociada } from 'src/core/entities/cuenta-asociada/cuenta-asociada.entity';
import { CuentaAsociadaRepository } from 'src/core/repositories/cuenta-asociada.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class CuentaAsociadaPrismaRepository implements CuentaAsociadaRepository {
  constructor(private prisma: PrismaService) {}

  async findCuentasByPadre(idpadre: number): Promise<CuentaAsociada[]> {
    const data = await this.prisma.cuenta_asociada.findMany({
      where: { idpadre },
      include: {
        usuarios: {
          select: { id: true, username: true, email: true },
        },
      },
      orderBy: { fechacreacion: 'desc' },
    });
    return data.map((item) => CuentaAsociada.fromPrisma(item));
  }

  async findCuentaByIdAndPadre(id: number, idpadre: number): Promise<CuentaAsociada | null> {
    const data = await this.prisma.cuenta_asociada.findFirst({
      where: { id, idpadre },
      include: {
        usuarios: {
          select: { id: true, username: true, email: true },
        },
      },
    });
    return data ? CuentaAsociada.fromPrisma(data) : null;
  }

  async updateAlias(id: number, alias: string): Promise<CuentaAsociada> {
    const data = await this.prisma.cuenta_asociada.update({
      where: { id },
      data: { alias },
      include: {
        usuarios: {
          select: { id: true, username: true, email: true },
        },
      },
    });
    return CuentaAsociada.fromPrisma(data);
  }

  async deleteRelacion(id: number): Promise<CuentaAsociada> {
    const data = await this.prisma.cuenta_asociada.delete({
      where: { id },
      include: {
        usuarios: {
          select: { id: true, username: true, email: true },
        },
      },
    });
    return CuentaAsociada.fromPrisma(data);
  }
  async updateEstado(id: number, estado: 'ACTIVA' | 'INACTIVA'): Promise<CuentaAsociada> {
  const data = await this.prisma.cuenta_asociada.update({
    where: { id },
    data: { estado },
    include: {
      usuarios: {
        select: { id: true, username: true, email: true },
      },
    },
  });
  return CuentaAsociada.fromPrisma(data);
}
}
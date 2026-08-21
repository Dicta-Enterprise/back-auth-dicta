import { Injectable } from '@nestjs/common';
import { CuentaAsociada } from 'src/core/entities/cuenta-asociada/cuenta-asociada.entity';
import { CuentaAsociadaRepository } from 'src/core/repositories/cuenta-asociada.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { TipoCuentaFamiliar } from 'generated/prisma'; // ← revisa esta ruta, ver nota abajo

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

  async asociarUsuario(id: number, idusuario: number): Promise<CuentaAsociada> {
    const data = await this.prisma.cuenta_asociada.update({
      where: { id },
      data: { idusuario },
      include: {
        usuarios: {
          select: { id: true, username: true, email: true },
        },
      },
    });
    return CuentaAsociada.fromPrisma(data);
  }

  async crear(data: {
    idpadre: number;
    idinvitacion: number;
    correo: string;
    alias: string;
    fechanacimiento: Date;
    tipocuenta: string;
  }): Promise<CuentaAsociada> {
    const nueva = await this.prisma.cuenta_asociada.create({
      data: {
        idpadre: data.idpadre,
        idinvitacion: data.idinvitacion,
        correo: data.correo,
        alias: data.alias,
        fechanacimiento: data.fechanacimiento,
        tipocuenta: data.tipocuenta as TipoCuentaFamiliar,
      },
      include: {
        usuarios: {
          select: { id: true, username: true, email: true },
        },
      },
    });
    return CuentaAsociada.fromPrisma(nueva);
  }
}

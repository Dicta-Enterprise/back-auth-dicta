import { Injectable } from '@nestjs/common';
import { Familia } from 'src/core/entities/familia/familia.entity';
import { FamiliaConMiembros } from 'src/core/entities/familia/familia-con-miembros.entity';
import { FamiliaRepository } from 'src/core/repositories/familia.repository';
import { formatearIdFamilia, formatearIdUsuario } from 'src/core/services/identificadores/identificadores';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class FamiliaPrismaRepository implements FamiliaRepository {
  constructor(private prisma: PrismaService) {}

  async findByPadre(idpadre: number): Promise<Familia | null> {
    const data = await this.prisma.familia.findUnique({ where: { idpadre } });
    return data ? Familia.fromPrisma(data) : null;
  }

  async crear(idpadre: number): Promise<Familia> {
    const data = await this.prisma.familia.create({ data: { idpadre } });
    return Familia.fromPrisma(data);
  }

  async actualizarNombre(idpadre: number, nombre: string): Promise<Familia> {
    const data = await this.prisma.familia.update({
      where: { idpadre },
      data: { nombre },
    });
    return Familia.fromPrisma(data);
  }

  async listarConMiembros(): Promise<FamiliaConMiembros[]> {
    const familias = await this.prisma.familia.findMany({
      orderBy: { id: 'asc' },
      include: { padre: { select: { id: true, username: true, email: true } } },
    });
    return this.conMiembros(familias);
  }

  async findConMiembrosPorPadre(idpadre: number): Promise<FamiliaConMiembros | null> {
    const familia = await this.prisma.familia.findUnique({
      where: { idpadre },
      include: { padre: { select: { id: true, username: true, email: true } } },
    });
    if (!familia) {
      return null;
    }
    const [resultado] = await this.conMiembros([familia]);
    return resultado;
  }

  // Los miembros son las cuentas asociadas del padre que ya tienen usuario propio
  // (las pendientes aún no tienen idusuario, así que todavía no pueden generar progreso).
  private async conMiembros(
    familias: {
      id: number;
      idpadre: number;
      nombre: string | null;
      padre: { id: number; username: string; email: string };
    }[],
  ): Promise<FamiliaConMiembros[]> {
    if (familias.length === 0) {
      return [];
    }

    const cuentas = await this.prisma.cuenta_asociada.findMany({
      where: {
        idpadre: { in: familias.map((f) => f.idpadre) },
        idusuario: { not: null },
      },
      orderBy: { id: 'asc' },
    });

    return familias.map((f) => ({
      id: f.id,
      codigo: formatearIdFamilia(f.id),
      nombre: f.nombre,
      padre: { ...f.padre, codigo: formatearIdUsuario('P', f.padre.id) },
      miembros: cuentas
        .filter((c) => c.idpadre === f.idpadre)
        .map((c) => ({
          idcuenta: c.id,
          idusuario: c.idusuario as number,
          codigo: formatearIdUsuario(c.tipocuenta === 'JOVEN' ? 'J' : 'N', c.idusuario as number),
          alias: c.alias,
          tipocuenta: c.tipocuenta,
          estado: c.estado,
        })),
    }));
  }
}

import { Injectable } from '@nestjs/common';
import { CursoAsignado } from 'src/core/entities/curso-asignado/curso-asignado.entity';
import { CursoAsignadoRepository } from 'src/core/repositories/curso-asignado.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class CursoAsignadoPrismaRepository implements CursoAsignadoRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: { idcuentaasociada: number; idcurso: string }): Promise<CursoAsignado> {
    const created = await this.prisma.cursoasignado.create({ data });
    return CursoAsignado.fromPrisma(created);
  }

  async findByCuentaAndCurso(idcuentaasociada: number, idcurso: string): Promise<CursoAsignado | null> {
    const data = await this.prisma.cursoasignado.findFirst({
      where: { idcuentaasociada, idcurso },
    });
    return data ? CursoAsignado.fromPrisma(data) : null;
  }

  async findByCuenta(idcuentaasociada: number): Promise<CursoAsignado[]> {
    const data = await this.prisma.cursoasignado.findMany({
      where: { idcuentaasociada },
      orderBy: { fechaasignacion: 'desc' },
    });
    return data.map((item) => CursoAsignado.fromPrisma(item));
  }

  async findById(id: number): Promise<CursoAsignado | null> {
    const data = await this.prisma.cursoasignado.findUnique({ where: { id } });
    return data ? CursoAsignado.fromPrisma(data) : null;
  }

  async reasignar(id: number, idcuentaasociada: number): Promise<CursoAsignado> {
    const data = await this.prisma.cursoasignado.update({
      where: { id },
      data: { idcuentaasociada },
    });
    return CursoAsignado.fromPrisma(data);
  }

  async delete(id: number): Promise<CursoAsignado> {
    const data = await this.prisma.cursoasignado.delete({ where: { id } });
    return CursoAsignado.fromPrisma(data);
  }
}



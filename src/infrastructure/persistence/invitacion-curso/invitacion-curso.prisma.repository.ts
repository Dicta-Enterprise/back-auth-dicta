import { Injectable } from '@nestjs/common';
import { InvitacionCurso } from 'src/core/entities/invitacion-curso/invitacion-curso.entity';
import { InvitacionCursoRepository } from 'src/core/repositories/invitacion-curso.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

const includeCuentaAsociada = {
  cuentaAsociada: {
    select: { id: true, idpadre: true, alias: true, tipocuenta: true },
  },
};

@Injectable()
export class InvitacionCursoPrismaRepository implements InvitacionCursoRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    idCuentaAsociada: number;
    correo: string;
    token: string;
    cursoId: string;
    fechaExpiracion: Date;
  }): Promise<InvitacionCurso> {
    const creada = await this.prisma.invitacionFamiliar.create({
      data,
      include: includeCuentaAsociada,
    });
    return InvitacionCurso.fromPrisma(creada);
  }

  async findByToken(token: string): Promise<InvitacionCurso | null> {
    const data = await this.prisma.invitacionFamiliar.findUnique({
      where: { token },
      include: includeCuentaAsociada,
    });
    return data ? InvitacionCurso.fromPrisma(data) : null;
  }

  async findByIdAndPadre(id: string, idpadre: number): Promise<InvitacionCurso | null> {
    const data = await this.prisma.invitacionFamiliar.findFirst({
      where: { id, cuentaAsociada: { idpadre } },
      include: includeCuentaAsociada,
    });
    return data ? InvitacionCurso.fromPrisma(data) : null;
  }

  async findAllByPadre(idpadre: number): Promise<InvitacionCurso[]> {
    const data = await this.prisma.invitacionFamiliar.findMany({
      where: { cuentaAsociada: { idpadre } },
      include: includeCuentaAsociada,
      orderBy: { fechaCreacion: 'desc' },
    });
    return data.map((item) => InvitacionCurso.fromPrisma(item));
  }

  async updateReenvio(id: string, token: string, fechaExpiracion: Date): Promise<InvitacionCurso> {
    const data = await this.prisma.invitacionFamiliar.update({
      where: { id },
      data: { token, fechaExpiracion },
      include: includeCuentaAsociada,
    });
    return InvitacionCurso.fromPrisma(data);
  }

  async updateEstado(id: string, estado: 'CANCELADA' | 'EXPIRADA'): Promise<InvitacionCurso> {
    const data = await this.prisma.invitacionFamiliar.update({
      where: { id },
      data: { estado },
      include: includeCuentaAsociada,
    });
    return InvitacionCurso.fromPrisma(data);
  }

  async marcarAceptada(id: string): Promise<InvitacionCurso> {
    const data = await this.prisma.invitacionFamiliar.update({
      where: { id },
      data: { estado: 'ACEPTADA', fechaAceptacion: new Date() },
      include: includeCuentaAsociada,
    });
    return InvitacionCurso.fromPrisma(data);
  }
}

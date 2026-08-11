import { Inject, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { INVITACION_CURSO_REPOSITORY } from 'src/core/constants/constants';
import { InvitacionCurso } from 'src/core/entities/invitacion-curso/invitacion-curso.entity';
import { InvitacionCursoRepository } from 'src/core/repositories/invitacion-curso.repository';

const DURACION_INVITACION_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

@Injectable()
export class InvitacionCursoService {
  constructor(
    @Inject(INVITACION_CURSO_REPOSITORY)
    private readonly repository: InvitacionCursoRepository,
  ) {}

  generarToken(): string {
    return randomBytes(32).toString('hex');
  }

  nuevaFechaExpiracion(): Date {
    return new Date(Date.now() + DURACION_INVITACION_MS);
  }

  async crear(data: {
    idCuentaAsociada: number;
    correo: string;
    cursoId: string;
  }): Promise<InvitacionCurso> {
    return this.repository.create({
      ...data,
      token: this.generarToken(),
      fechaExpiracion: this.nuevaFechaExpiracion(),
    });
  }

  async buscarPorToken(token: string): Promise<InvitacionCurso | null> {
    return this.repository.findByToken(token);
  }

  async buscarPorIdYPadre(id: string, idpadre: number): Promise<InvitacionCurso | null> {
    return this.repository.findByIdAndPadre(id, idpadre);
  }

  async listarPorPadre(idpadre: number): Promise<InvitacionCurso[]> {
    return this.repository.findAllByPadre(idpadre);
  }

  async reenviar(id: string): Promise<InvitacionCurso> {
    return this.repository.updateReenvio(id, this.generarToken(), this.nuevaFechaExpiracion());
  }

  async cancelar(id: string): Promise<InvitacionCurso> {
    return this.repository.updateEstado(id, 'CANCELADA');
  }

  async marcarExpirada(id: string): Promise<InvitacionCurso> {
    return this.repository.updateEstado(id, 'EXPIRADA');
  }

  async marcarAceptada(id: string): Promise<InvitacionCurso> {
    return this.repository.marcarAceptada(id);
  }

  estaVigente(invitacion: InvitacionCurso): boolean {
    return invitacion.estado === 'PENDIENTE' && invitacion.fechaExpiracion.getTime() > Date.now();
  }
}

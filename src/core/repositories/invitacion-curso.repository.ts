import { InvitacionCurso } from '../entities/invitacion-curso/invitacion-curso.entity';

export interface InvitacionCursoRepository {
  create(data: {
    idCuentaAsociada: number;
    correo: string;
    token: string;
    cursoId: string;
    fechaExpiracion: Date;
  }): Promise<InvitacionCurso>;
  findByToken(token: string): Promise<InvitacionCurso | null>;
  findByIdAndPadre(id: string, idpadre: number): Promise<InvitacionCurso | null>;
  findAllByPadre(idpadre: number): Promise<InvitacionCurso[]>;
  updateReenvio(id: string, token: string, fechaExpiracion: Date): Promise<InvitacionCurso>;
  updateEstado(id: string, estado: 'CANCELADA' | 'EXPIRADA'): Promise<InvitacionCurso>;
  marcarAceptada(id: string): Promise<InvitacionCurso>;
}

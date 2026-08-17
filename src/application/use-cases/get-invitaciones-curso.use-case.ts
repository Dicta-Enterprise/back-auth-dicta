import { Injectable } from '@nestjs/common';
import { InvitacionCursoService } from 'src/core/services/invitacion-curso/invitacion-curso.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetInvitacionesCursoUseCase {
  constructor(private readonly invitacionService: InvitacionCursoService) {}

  async execute(idpadre: number) {
    try {
      const invitaciones = await this.invitacionService.listarPorPadre(idpadre);
      return Result.okList(invitaciones);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al obtener las invitaciones.'));
    }
  }
}

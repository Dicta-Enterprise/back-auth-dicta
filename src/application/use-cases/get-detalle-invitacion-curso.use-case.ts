import { Injectable } from '@nestjs/common';
import { InvitacionCursoService } from 'src/core/services/invitacion-curso/invitacion-curso.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetDetalleInvitacionCursoUseCase {
  constructor(private readonly invitacionService: InvitacionCursoService) {}

  async execute(id: string, idpadre: number) {
    try {
      const invitacion = await this.invitacionService.buscarPorIdYPadre(id, idpadre);
      if (!invitacion) {
        return Result.fail(new Error('Invitación no encontrada o no autorizada.'));
      }
      return Result.ok(invitacion);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al obtener el detalle de la invitación.'));
    }
  }
}

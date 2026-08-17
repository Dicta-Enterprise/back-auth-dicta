import { Injectable } from '@nestjs/common';
import { InvitacionCursoService } from 'src/core/services/invitacion-curso/invitacion-curso.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class ValidarTokenInvitacionCursoUseCase {
  constructor(private readonly invitacionService: InvitacionCursoService) {}

  async execute(token: string) {
    try {
      const invitacion = await this.invitacionService.buscarPorToken(token);
      if (!invitacion) {
        return Result.fail(new Error('La invitación no existe.'));
      }

      if (invitacion.estado === 'CANCELADA' || invitacion.estado === 'ACEPTADA') {
        return Result.fail(new Error('Esta invitación ya no está disponible.'));
      }

      if (invitacion.estado === 'EXPIRADA' || invitacion.fechaExpiracion.getTime() <= Date.now()) {
        if (invitacion.estado !== 'EXPIRADA') {
          await this.invitacionService.marcarExpirada(invitacion.id);
        }
        return Result.fail(new Error('El token de invitación ha expirado.'));
      }

      return Result.ok({
        correo: invitacion.correo,
        cursoId: invitacion.cursoId,
        alias: invitacion.cuentaAsociada?.alias ?? null,
        tipocuenta: invitacion.cuentaAsociada?.tipocuenta ?? null,
        fechaExpiracion: invitacion.fechaExpiracion,
      });
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al validar la invitación.'));
    }
  }
}

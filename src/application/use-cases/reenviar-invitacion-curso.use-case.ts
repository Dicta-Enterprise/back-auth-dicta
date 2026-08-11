import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InvitacionCursoService } from 'src/core/services/invitacion-curso/invitacion-curso.service';
import { MailerService } from 'src/core/services/mailer/mailer.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class ReenviarInvitacionCursoUseCase {
  private readonly logger = new Logger(ReenviarInvitacionCursoUseCase.name);

  constructor(
    private readonly invitacionService: InvitacionCursoService,
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  async execute(id: string, idpadre: number) {
    try {
      const invitacion = await this.invitacionService.buscarPorIdYPadre(id, idpadre);
      if (!invitacion) {
        return Result.fail(new Error('Invitación no encontrada o no autorizada.'));
      }

      if (invitacion.estado !== 'PENDIENTE') {
        return Result.fail(new Error('Solo se pueden reenviar invitaciones pendientes.'));
      }

      const actualizada = await this.invitacionService.reenviar(id);

      try {
        await this.mailerService.enviar({
          to: actualizada.correo,
          nombreUsuario: actualizada.correo,
          subject: 'Te invitaron a unirte a Dicta',
          templateId: this.config.get<number>('BREVO_TEMPLATE_INVITACION_FAMILIAR'),
          context: {
            urlInvitacion: `${this.config.get('FRONTEND_URL', '')}/auth/invitacion?token=${actualizada.token}`,
            year: new Date().getFullYear(),
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          this.logger.error(`Error al reenviar correo de invitación a ${actualizada.correo}: ${error.message}`, error.stack);
        }
      }

      return Result.ok(actualizada);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al reenviar la invitación.'));
    }
  }
}

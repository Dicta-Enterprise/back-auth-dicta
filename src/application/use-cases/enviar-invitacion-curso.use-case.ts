import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CuentaAsociadaService } from 'src/core/services/cuenta-asociada/cuenta-asociada.service';
import { InvitacionCursoService } from 'src/core/services/invitacion-curso/invitacion-curso.service';
import { MailerService } from 'src/core/services/mailer/mailer.service';
import { Result } from 'src/shared/domain/result/result';
import { EnviarInvitacionCursoDto } from '../dto/enviar-invitacion-curso.dto';

@Injectable()
export class EnviarInvitacionCursoUseCase {
  private readonly logger = new Logger(EnviarInvitacionCursoUseCase.name);

  constructor(
    private readonly invitacionService: InvitacionCursoService,
    private readonly cuentaAsociadaService: CuentaAsociadaService,
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  async execute(dto: EnviarInvitacionCursoDto, idpadre: number) {
    try {
      const cuenta = await this.cuentaAsociadaService.obtenerCuentaPorIdYPadre(dto.idCuentaAsociada, idpadre);
      if (!cuenta) {
        return Result.fail(new Error('Cuenta asociada no encontrada o no autorizada.'));
      }

      const invitacion = await this.invitacionService.crear({
        idCuentaAsociada: dto.idCuentaAsociada,
        correo: dto.correo,
        cursoId: dto.cursoId,
      });

      await this.enviarCorreo(invitacion.correo, invitacion.token);

      return Result.ok(invitacion);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al enviar la invitación.'));
    }
  }

  private async enviarCorreo(correo: string, token: string): Promise<void> {
    try {
      await this.mailerService.enviar({
        to: correo,
        nombreUsuario: correo,
        subject: 'Te invitaron a unirte a Dicta',
        templateId: this.config.get<number>('BREVO_TEMPLATE_INVITACION_FAMILIAR'),
        context: {
          urlInvitacion: `${this.config.get('FRONTEND_URL', '')}/auth/invitacion?token=${token}`,
          year: new Date().getFullYear(),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error al enviar correo de invitación a ${correo}: ${error.message}`, error.stack);
      }
    }
  }
}

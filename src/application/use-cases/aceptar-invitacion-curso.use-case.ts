import { Injectable } from '@nestjs/common';
import { CuentaAsociadaService } from 'src/core/services/cuenta-asociada/cuenta-asociada.service';
import { InvitacionCursoService } from 'src/core/services/invitacion-curso/invitacion-curso.service';
import { UsuariosService } from 'src/core/services/usuarios/usuarios.service';
import { Result } from 'src/shared/domain/result/result';
import { AceptarInvitacionCursoDto } from '../dto/aceptar-invitacion-curso.dto';

@Injectable()
export class AceptarInvitacionCursoUseCase {
  constructor(
    private readonly invitacionService: InvitacionCursoService,
    private readonly cuentaAsociadaService: CuentaAsociadaService,
    private readonly usuariosService: UsuariosService,
  ) {}

  async execute(dto: AceptarInvitacionCursoDto) {
    try {
      const invitacion = await this.invitacionService.buscarPorToken(dto.token);
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

      const nuevoUsuario = await this.usuariosService.crearUsuario({
        username: dto.username,
        email: invitacion.correo,
        password: dto.password,
        confirmPassword: dto.confirmPassword,
        acceptTerms: dto.acceptTerms,
      });

      await this.cuentaAsociadaService.asociarUsuario(invitacion.idCuentaAsociada, Number(nuevoUsuario.id));
      await this.invitacionService.marcarAceptada(invitacion.id);

      return Result.ok({
        usuario: {
          id: nuevoUsuario.id,
          username: nuevoUsuario.username,
          email: nuevoUsuario.email,
        },
        idCuentaAsociada: invitacion.idCuentaAsociada,
      });
    } catch (error) {
      if (error instanceof Error) {
        return Result.fail(new Error(error.message));
      }
      return Result.fail(new Error('Ocurrió un error desconocido al aceptar la invitación.'));
    }
  }
}

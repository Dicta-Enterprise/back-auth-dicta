import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { InvitacionFamiliarService } from 'src/core/services/invitacion-familiar/invitacion-familiar.service';
import { CuentaAsociadaService } from 'src/core/services/cuenta-asociada/cuenta-asociada.service';
import { CreateCuentaAsociadaDto } from '../dto/create-cuenta-asociada.dto';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class CreateCuentaAsociadaUseCase {
  constructor(
    private readonly service: InvitacionFamiliarService,
    private readonly cuentaAsociadaService: CuentaAsociadaService,
  ) {}

  async execute(dto: CreateCuentaAsociadaDto, idpadre: number) {
    try {
      const existente = await this.service.buscarPorCorreoYPadre(dto.correo, idpadre);
      if (existente) {
        return Result.fail(new Error('Este correo ya tiene una invitación asociada.'));
      }

      const token = randomBytes(32).toString('hex');
      const fechaexpiracion = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

      const invitacion = await this.service.crear({
        idpadre,
        correo: dto.correo,
        nombre: dto.alias,
        alias: dto.alias,
        fechanacimiento: new Date(dto.fechaNacimiento),
        tipocuenta: dto.tipoCuenta,
        token,
        fechaexpiracion,
      });

      await this.cuentaAsociadaService.crear({
        idpadre,
        idinvitacion: invitacion.id,
        correo: dto.correo,
        alias: dto.alias,
        fechanacimiento: new Date(dto.fechaNacimiento),
        tipocuenta: dto.tipoCuenta,
      });

      return Result.ok(invitacion);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al crear la invitación.'));
    }
  }
}


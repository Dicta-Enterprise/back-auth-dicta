import { Inject, Injectable } from '@nestjs/common';
import { INVITACION_FAMILIAR_REPOSITORY } from 'src/core/constants/constants';
import { InvitacionFamiliar } from 'src/core/entities/invitacion-familiar/invitacion-familiar.entity';
import { InvitacionFamiliarRepository } from 'src/core/repositories/invitacion-familiar.repository';

@Injectable()
export class InvitacionFamiliarService {
  constructor(
    @Inject(INVITACION_FAMILIAR_REPOSITORY)
    private readonly repository: InvitacionFamiliarRepository,
  ) {}

  async crear(data: {
    idpadre: number;
    correo: string;
    nombre: string;
    alias: string;
    fechanacimiento: Date;
    tipocuenta: 'NINO' | 'JOVEN';
    token: string;
    fechaexpiracion: Date;
  }): Promise<InvitacionFamiliar> {
    return this.repository.create(data);
  }

  async buscarPorCorreoYPadre(correo: string, idpadre: number): Promise<InvitacionFamiliar | null> {
    return this.repository.findByCorreoAndPadre(correo, idpadre);
  }
}



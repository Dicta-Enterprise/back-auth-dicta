import { InvitacionFamiliar } from '../entities/invitacion-familiar/invitacion-familiar.entity';

export interface InvitacionFamiliarRepository {
  create(data: {
    idpadre: number;
    correo: string;
    nombre: string;
    alias: string;
    fechanacimiento: Date;
    tipocuenta: 'NINO' | 'JOVEN';
    token: string;
    fechaexpiracion: Date;
  }): Promise<InvitacionFamiliar>;
  findByCorreoAndPadre(correo: string, idpadre: number): Promise<InvitacionFamiliar | null>;
}
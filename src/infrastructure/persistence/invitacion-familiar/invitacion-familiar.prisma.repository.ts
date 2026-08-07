import { Injectable } from '@nestjs/common';
import { InvitacionFamiliar } from 'src/core/entities/invitacion-familiar/invitacion-familiar.entity';
import { InvitacionFamiliarRepository } from 'src/core/repositories/invitacion-familiar.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class InvitacionFamiliarPrismaRepository implements InvitacionFamiliarRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    idpadre: number;
    correo: string;
    nombre: string;
    alias: string;
    fechanacimiento: Date;
    tipocuenta: 'NINO' | 'JOVEN';
    token: string;
    fechaexpiracion: Date;
  }): Promise<InvitacionFamiliar> {
    const created = await this.prisma.invitacionfamiliar.create({
      data,
    });
    return InvitacionFamiliar.fromPrisma(created);
  }

  async findByCorreoAndPadre(correo: string, idpadre: number): Promise<InvitacionFamiliar | null> {
    const data = await this.prisma.invitacionfamiliar.findFirst({
      where: { correo, idpadre },
    });
    return data ? InvitacionFamiliar.fromPrisma(data) : null;
  }
}

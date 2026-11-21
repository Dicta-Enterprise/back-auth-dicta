import { Injectable } from '@nestjs/common';
import { FilaFamiliaBase, FilaUsuarioBase } from 'src/core/entities/usuario-admin/usuario-admin.entity';
import { UsuarioAdminRepository } from 'src/core/repositories/usuario-admin.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

// Roles de back-auth: 3 Cliente y 4 Usuario pendiente. Los administradores (1) y trabajadores (2) no son usuarios de la LMS.
const ROLES_LMS = [3, 4];

@Injectable()
export class UsuarioAdminPrismaRepository implements UsuarioAdminRepository {
  constructor(private prisma: PrismaService) {}

  async findUsuariosLms(): Promise<FilaUsuarioBase[]> {
    const data = await this.prisma.usuarios.findMany({
      where: {
        OR: [{ idrol: { in: ROLES_LMS } }, { cuenta_asociada: { some: {} } }],
      },
      select: {
        id: true,
        uuid: true,
        username: true,
        email: true,
        idrol: true,
        estado: true,
        fechadecreacion: true,
        cuenta_asociada: {
          select: { tipocuenta: true, alias: true, estado: true, idpadre: true },
          take: 1,
        },
      },
    });

    return data.map((u) => ({
      id: u.id,
      uuid: u.uuid,
      username: u.username,
      email: u.email,
      idrol: u.idrol,
      estado: u.estado,
      fechadecreacion: u.fechadecreacion,
      cuentaComoHijo: u.cuenta_asociada[0]
        ? {
            tipocuenta: u.cuenta_asociada[0].tipocuenta,
            alias: u.cuenta_asociada[0].alias,
            estado: u.cuenta_asociada[0].estado,
            idpadre: u.cuenta_asociada[0].idpadre,
          }
        : null,
    }));
  }

  async findFamilias(): Promise<FilaFamiliaBase[]> {
    return this.prisma.familia.findMany({ select: { id: true, uuid: true, idpadre: true, nombre: true } });
  }
}

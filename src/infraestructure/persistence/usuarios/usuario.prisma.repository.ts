import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { Usuario } from 'src/core/entities/usuario.enity';
import { UsuarioRepository } from 'src/core/repositories/usuario.repository';

@Injectable()
export class UsuarioPrismaRepository implements UsuarioRepository {
  constructor(private prisma: PrismaService) {}

  async create(usuario: Usuario): Promise<Usuario> {
    const data= await this.prisma.usuarios.create({
    data: {
        username: usuario.username,
        email: usuario.email,
        password: usuario.password,
        estado: usuario.estado,
        fechadecreacion: usuario.fechadecreacion
    }
    });
    return Usuario.fromPrisma(data);
  }
  async findByEmail(email: string): Promise<Usuario | null> {
    const data = await this.prisma.usuarios.findFirst({
      where: { email },
    });
    return data ? Usuario.fromPrisma(data) : null;
  }

  
}
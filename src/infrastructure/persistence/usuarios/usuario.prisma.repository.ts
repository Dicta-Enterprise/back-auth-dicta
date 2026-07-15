import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { Usuario } from 'src/core/entities/auth/usuario.enity';
import { UsuarioRepository } from 'src/core/repositories/usuario.repository';

@Injectable()
export class UsuarioPrismaRepository implements UsuarioRepository {
  constructor(private prisma: PrismaService) {}

  async create(usuario: Usuario): Promise<Usuario> {
    const data= await this.prisma.usuarios.create({
    data: {
        username: usuario.username,
        email: usuario.email,
        auth_provider: usuario.authProvider,
        password: usuario.password,
        estado: usuario.estado,
        fechadecreacion: usuario.fechadecreacion,
        googleId: usuario.googleId,
        terminos_condiciones: usuario.acceptTerms,
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

  async findByGoogleId(googleId: string) {
  const data=await this.prisma.usuarios.findFirst({
    where: { googleId },
  });
  return data ? Usuario.fromPrisma(data) : null;
}

async saveResetCode(id: number, code: string, expires: Date): Promise<void> {
  await this.prisma.usuarios.update({
    where: { id },
    data: {
      reset_code: code,
      reset_code_expires: expires,
      reset_attempts: 0, 
    },
  });
}

async updatePassword(id: number, hashedPassword: string): Promise<void> {
  await this.prisma.usuarios.update({
    where: { id },
    data: {
      password: hashedPassword,
      reset_code: null,
      reset_code_expires: null,
      reset_attempts: 0,
    },
  });
}

async incrementResetAttempts(id: number): Promise<void> {
  await this.prisma.usuarios.update({
    where: { id },
    data: {
      reset_attempts: { increment: 1 },
    },
  });
}

async saveVerifyCode(id: number, code: string, expires: Date): Promise<void> {
  await this.prisma.usuarios.update({
    where: { id },
    data: {
      verify_code: code,
      verify_code_expires: expires,
      verify_attempts: 0,
    },
  });
}

async activarUsuario(id: number): Promise<void> {
  await this.prisma.usuarios.update({
    where: { id },
    data: {
      idrol: 3,             // Cliente
      verify_code: null,
      verify_code_expires: null,
      verify_attempts: 0,
    },
  });
}

async incrementVerifyAttempts(id: number): Promise<void> {
  await this.prisma.usuarios.update({
    where: { id },
    data: {
      verify_attempts: { increment: 1 },
    },
  });
}

async eliminarUsuario(id: number): Promise<void> {
  await this.prisma.usuarios.delete({
    where: { id },
  });
}
}
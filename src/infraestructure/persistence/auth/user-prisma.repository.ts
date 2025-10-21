import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../core/repositories/auth/user.repository';
import { UserEntity } from '../../../core/entities/auth/user.entity';
import { PrismaService } from '../../../core/services/prisma/prisma.service';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.usuarios.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    return user ? UserEntity.fromPrisma(user) : null;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.prisma.usuarios.findFirst({
      where: {
        username: username,
      },
    });

    return user ? UserEntity.fromPrisma(user) : null;
  }

  async create(data: {
    username: string;
    email: string;
    password: string;
  }): Promise<UserEntity> {
    const user = await this.prisma.usuarios.create({
      data: {
        username: data.username,
        email: data.email.toLowerCase(),
        password: data.password,
        // estado y fechadecreacion usan @default del schema
      },
    });

    return UserEntity.fromPrisma(user);
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: number) {
    return await this.prisma.usuarios.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
  }
}
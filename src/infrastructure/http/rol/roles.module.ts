import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { ROL_REPOSITORY } from 'src/core/constants/constants';
import { RolPrismaRepository } from 'src/infrastructure/persistence/rol/rol.prisma.repository';
import { RolService } from 'src/core/services/rol/rol.service';
import { CreateRolUseCase } from 'src/application/use-cases/create-rol.use-case';
import { RegistrarRolesBaseUseCase } from 'src/application/use-cases/registrar-roles-base.use-case';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Module({
  controllers: [RolesController],
  providers: [
    {
      provide: ROL_REPOSITORY,
      useClass: RolPrismaRepository,
    },
    RolService,
    CreateRolUseCase,
    RegistrarRolesBaseUseCase,
    PrismaService,
  ],
  exports: [RolService],
})
export class RolesModule {}
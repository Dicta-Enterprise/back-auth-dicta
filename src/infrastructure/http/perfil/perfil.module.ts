import { Module } from '@nestjs/common';
import { PerfilController } from './perfil.controller';
import { PerfilService } from 'src/core/services/perfil/perfil.service';
import { CreateProfileUseCase } from 'src/application/use-cases/create-profile.use-case';
import { PERFIL_REPOSITORY } from 'src/core/constants/constants';
import { PerfilPrismaRepository } from 'src/infrastructure/persistence/perfil/perfil.prisma.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { GetProfilesUseCase } from 'src/application/use-cases/get-profiles.use-case';

@Module({
  controllers: [PerfilController],
  providers: [
    {
      provide: PERFIL_REPOSITORY,
      useClass: PerfilPrismaRepository,
    },
    PerfilService,
    CreateProfileUseCase,
    PrismaService, 
    ValidatorService, 
    GetProfilesUseCase  
],
  exports: [PerfilService],
})
export class PerfilModule {}
import { Module } from '@nestjs/common';
import { UBICACION_USUARIO_REPOSITORY } from 'src/core/constants/constants';
import { GeoService } from 'src/core/services/geo/geo.service';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { UbicacionUsuarioService } from 'src/core/services/ubicacion-usuario/ubicacion-usuario.service';
import { DetectarUbicacionUsuarioUseCase } from 'src/application/use-cases/detectar-ubicacion-usuario.use-case';
import { GetUbicacionUsuarioUseCase } from 'src/application/use-cases/get-ubicacion-usuario.use-case';
import { UbicacionUsuarioPrismaRepository } from 'src/infrastructure/persistence/ubicacion-usuario/ubicacion-usuario.prisma.repository';
import { UbicacionUsuarioController } from './ubicacion-usuario.controller';

@Module({
  controllers: [UbicacionUsuarioController],
  providers: [
    {
      provide: UBICACION_USUARIO_REPOSITORY,
      useClass: UbicacionUsuarioPrismaRepository,
    },
    GeoService,
    UbicacionUsuarioService,
    GetUbicacionUsuarioUseCase,
    DetectarUbicacionUsuarioUseCase,
    PrismaService,
  ],
})
export class UbicacionUsuarioModule {}

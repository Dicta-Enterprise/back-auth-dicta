import { Module } from '@nestjs/common';
import { PermisosController } from './permisos.controller';
import { DETALLE_PERMISO_REPOSITORY, PERMISO_REPOSITORY } from 'src/core/constants/constants';
import { PermisoPrismaRepository } from 'src/infrastructure/persistence/permiso/permiso.prisma.repository';
import { DetallePermisoPrismaRepository } from 'src/infrastructure/persistence/detallepermiso/detalle-permiso.prisma.repository';
import { PermisoService } from 'src/core/services/permiso/permiso.service';
import { DetallePermisoService } from 'src/core/services/detalle-permiso/detalle-permiso.service';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Module({
  controllers: [PermisosController],
  providers: [
    {
      provide: PERMISO_REPOSITORY,
      useClass: PermisoPrismaRepository,
    },
    {
      provide: DETALLE_PERMISO_REPOSITORY,
      useClass: DetallePermisoPrismaRepository,
    },
    PermisoService,
    DetallePermisoService,
    PrismaService,
  ],
  exports: [PermisoService, DetallePermisoService],
})
export class PermisosModule {}
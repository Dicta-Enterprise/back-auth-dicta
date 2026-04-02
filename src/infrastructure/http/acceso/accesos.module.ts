import { Module } from '@nestjs/common';
import { AccesosController } from './accesos.controller';
import { ACCESO_REPOSITORY } from 'src/core/constants/constants';
import { AccesoPrismaRepository } from 'src/infrastructure/persistence/acceso/acceso.prisma.repository';
import { AccesoService } from 'src/core/services/acceso/acceso.service';
import { CreateAccesoDto } from 'src/application/dto/create-acceso.dto';
import { CreateAccesoUseCase } from 'src/application/use-cases/create-acceso.use-case';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Module({
    controllers: [AccesosController],
    providers: [
        {
              provide: ACCESO_REPOSITORY,
              useClass: AccesoPrismaRepository,
        },
        AccesoService,
        CreateAccesoDto,
        CreateAccesoUseCase,
        PrismaService
    ],
})
export class AccesosModule {
    
}
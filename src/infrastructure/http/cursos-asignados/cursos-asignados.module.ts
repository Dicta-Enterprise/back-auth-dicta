import { Module } from '@nestjs/common';
import { CursosAsignadosController } from './cursos-asignados.controller';
import { CURSO_ASIGNADO_REPOSITORY } from 'src/core/constants/constants';
import { CursoAsignadoPrismaRepository } from 'src/infrastructure/persistence/curso-asignado/curso-asignado.prisma.repository';
import { CursoAsignadoService } from 'src/core/services/curso-asignado/curso-asignado.service';
import { CreateCursoAsignadoUseCase } from 'src/application/use-cases/create-curso-asignado.use-case';
import { GetCursosPorCuentaUseCase } from 'src/application/use-cases/get-cursos-por-cuenta.use-case';
import { GetCursoAsignadoDetalleUseCase } from 'src/application/use-cases/get-curso-asignado-detalle.use-case';
import { ReasignarCursoAsignadoUseCase } from 'src/application/use-cases/reasignar-curso-asignado.use-case';
import { DeleteCursoAsignadoUseCase } from 'src/application/use-cases/delete-curso-asignado.use-case';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Module({
  controllers: [CursosAsignadosController],
  providers: [
    {
      provide: CURSO_ASIGNADO_REPOSITORY,
      useClass: CursoAsignadoPrismaRepository,
    },
    CursoAsignadoService,
    CreateCursoAsignadoUseCase,
    GetCursosPorCuentaUseCase,
    GetCursoAsignadoDetalleUseCase,
    ReasignarCursoAsignadoUseCase,
    DeleteCursoAsignadoUseCase,
    PrismaService,
  ],
})
export class CursosAsignadosModule {}


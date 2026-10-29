import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  CUENTA_ASOCIADA_REPOSITORY,
  CURSO_ASIGNADO_REPOSITORY,
  FAMILIA_REPOSITORY,
  INVITACION_CURSO_REPOSITORY,
} from 'src/core/constants/constants';
import { CuentaAsociadaPrismaRepository } from 'src/infrastructure/persistence/cuenta-asociada/cuenta-asociada.prisma.repository';
import { CursoAsignadoPrismaRepository } from 'src/infrastructure/persistence/curso-asignado/curso-asignado.prisma.repository';
import { FamiliaPrismaRepository } from 'src/infrastructure/persistence/familia/familia.prisma.repository';
import { InvitacionCursoPrismaRepository } from 'src/infrastructure/persistence/invitacion-curso/invitacion-curso.prisma.repository';
import { CuentaAsociadaService } from 'src/core/services/cuenta-asociada/cuenta-asociada.service';
import { CursoAsignadoService } from 'src/core/services/curso-asignado/curso-asignado.service';
import { FamiliaService } from 'src/core/services/familia/familia.service';
import { InvitacionCursoService } from 'src/core/services/invitacion-curso/invitacion-curso.service';
import { TransactionApiService } from 'src/core/services/transaction/transaction-api.service';
import { PrismaService } from 'src/core/services/prisma/prisma.service';
import { MailerModule } from 'src/core/services/mailer/mailer.module';
import { AuthModule } from 'src/infrastructure/http/auth/auth.module';
import { EnviarInvitacionCursoUseCase } from 'src/application/use-cases/enviar-invitacion-curso.use-case';
import { ReenviarInvitacionCursoUseCase } from 'src/application/use-cases/reenviar-invitacion-curso.use-case';
import { CancelarInvitacionCursoUseCase } from 'src/application/use-cases/cancelar-invitacion-curso.use-case';
import { GetInvitacionesCursoUseCase } from 'src/application/use-cases/get-invitaciones-curso.use-case';
import { GetDetalleInvitacionCursoUseCase } from 'src/application/use-cases/get-detalle-invitacion-curso.use-case';
import { ValidarTokenInvitacionCursoUseCase } from 'src/application/use-cases/validar-token-invitacion-curso.use-case';
import { AceptarInvitacionCursoUseCase } from 'src/application/use-cases/aceptar-invitacion-curso.use-case';
import { InvitacionesCursoController } from './invitaciones-curso.controller';

@Module({
  imports: [ConfigModule, MailerModule, AuthModule],
  controllers: [InvitacionesCursoController],
  providers: [
    {
      provide: CUENTA_ASOCIADA_REPOSITORY,
      useClass: CuentaAsociadaPrismaRepository,
    },
    {
      provide: INVITACION_CURSO_REPOSITORY,
      useClass: InvitacionCursoPrismaRepository,
    },
    {
      provide: FAMILIA_REPOSITORY,
      useClass: FamiliaPrismaRepository,
    },
    {
      provide: CURSO_ASIGNADO_REPOSITORY,
      useClass: CursoAsignadoPrismaRepository,
    },
    CuentaAsociadaService,
    InvitacionCursoService,
    FamiliaService,
    CursoAsignadoService,
    TransactionApiService,
    PrismaService,
    EnviarInvitacionCursoUseCase,
    ReenviarInvitacionCursoUseCase,
    CancelarInvitacionCursoUseCase,
    GetInvitacionesCursoUseCase,
    GetDetalleInvitacionCursoUseCase,
    ValidarTokenInvitacionCursoUseCase,
    AceptarInvitacionCursoUseCase,
  ],
})
export class InvitacionesCursoModule {}

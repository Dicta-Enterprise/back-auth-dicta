import { Module } from '@nestjs/common';
import { CuentasAsociadasController } from './cuentas-asociadas.controller';
import { CUENTA_ASOCIADA_REPOSITORY, INVITACION_FAMILIAR_REPOSITORY } from 'src/core/constants/constants';
import { CuentaAsociadaPrismaRepository } from 'src/infrastructure/persistence/cuenta-asociada/cuenta-asociada.prisma.repository';
import { InvitacionFamiliarPrismaRepository } from 'src/infrastructure/persistence/invitacion-familiar/invitacion-familiar.prisma.repository';
import { CuentaAsociadaService } from 'src/core/services/cuenta-asociada/cuenta-asociada.service';
import { InvitacionFamiliarService } from 'src/core/services/invitacion-familiar/invitacion-familiar.service';
import { GetCuentasFamiliaresUseCase } from 'src/application/use-cases/get-cuentas-familiares.use-case';
import { GetDetalleCuentaFamiliarUseCase } from 'src/application/use-cases/get-detalle-cuenta-familiar.use-case';
import { UpdateAliasCuentaFamiliarUseCase } from 'src/application/use-cases/update-alias-cuenta-familiar.use-case';
import { DeleteCuentaFamiliarUseCase } from 'src/application/use-cases/delete-cuenta-familiar.use-case';
import { DesactivarCuentaAsociadaUseCase } from 'src/application/use-cases/desactivar-cuenta-asociada.use-case';
import { ReactivarCuentaAsociadaUseCase } from 'src/application/use-cases/reactivar-cuenta-asociada.use-case';
import { CreateCuentaAsociadaUseCase } from 'src/application/use-cases/create-cuenta-asociada.use-case';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Module({
  controllers: [CuentasAsociadasController],
  providers: [
    {
      provide: CUENTA_ASOCIADA_REPOSITORY,
      useClass: CuentaAsociadaPrismaRepository,
    },
    {
      provide: INVITACION_FAMILIAR_REPOSITORY,
      useClass: InvitacionFamiliarPrismaRepository,
    },
    CuentaAsociadaService,
    InvitacionFamiliarService,
    GetCuentasFamiliaresUseCase,
    GetDetalleCuentaFamiliarUseCase,
    UpdateAliasCuentaFamiliarUseCase,
    DeleteCuentaFamiliarUseCase,
    DesactivarCuentaAsociadaUseCase,
    ReactivarCuentaAsociadaUseCase,
    CreateCuentaAsociadaUseCase,
    PrismaService,
  ],
})
export class CuentasAsociadasModule {}
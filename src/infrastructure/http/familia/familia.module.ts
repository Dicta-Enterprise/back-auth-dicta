import { Module } from '@nestjs/common';
import { FamiliaController } from './familia.controller';
import { CUENTA_ASOCIADA_REPOSITORY } from 'src/core/constants/constants';
import { CuentaAsociadaPrismaRepository } from 'src/infrastructure/persistence/cuenta-asociada/cuenta-asociada.prisma.repository';
import { CuentaAsociadaService } from 'src/core/services/cuenta-asociada/cuenta-asociada.service';
import { GetCuentasFamiliaresUseCase } from 'src/application/use-cases/get-cuentas-familiares.use-case';
import { GetDetalleCuentaFamiliarUseCase } from 'src/application/use-cases/get-detalle-cuenta-familiar.use-case';
import { UpdateAliasCuentaFamiliarUseCase } from 'src/application/use-cases/update-alias-cuenta-familiar.use-case';
import { DeleteCuentaFamiliarUseCase } from 'src/application/use-cases/delete-cuenta-familiar.use-case';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Module({
  controllers: [FamiliaController],
  providers: [
    {
      provide: CUENTA_ASOCIADA_REPOSITORY,
      useClass: CuentaAsociadaPrismaRepository,
    },
    CuentaAsociadaService,
    GetCuentasFamiliaresUseCase,
    GetDetalleCuentaFamiliarUseCase,
    UpdateAliasCuentaFamiliarUseCase,
    DeleteCuentaFamiliarUseCase,
    PrismaService,
  ],
})
export class FamiliaModule {}
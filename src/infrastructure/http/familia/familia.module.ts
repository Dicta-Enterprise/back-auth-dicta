import { Module } from '@nestjs/common';
import { FamiliaController } from './familia.controller';
import { CUENTA_ASOCIADA_REPOSITORY, FAMILIA_REPOSITORY } from 'src/core/constants/constants';
import { CuentaAsociadaPrismaRepository } from 'src/infrastructure/persistence/cuenta-asociada/cuenta-asociada.prisma.repository';
import { FamiliaPrismaRepository } from 'src/infrastructure/persistence/familia/familia.prisma.repository';
import { CuentaAsociadaService } from 'src/core/services/cuenta-asociada/cuenta-asociada.service';
import { FamiliaService } from 'src/core/services/familia/familia.service';
import { GetCuentasFamiliaresUseCase } from 'src/application/use-cases/get-cuentas-familiares.use-case';
import { GetDetalleCuentaFamiliarUseCase } from 'src/application/use-cases/get-detalle-cuenta-familiar.use-case';
import { UpdateAliasCuentaFamiliarUseCase } from 'src/application/use-cases/update-alias-cuenta-familiar.use-case';
import { DeleteCuentaFamiliarUseCase } from 'src/application/use-cases/delete-cuenta-familiar.use-case';
import { GetMiFamiliaUseCase } from 'src/application/use-cases/get-mi-familia.use-case';
import { UpdateNombreFamiliaUseCase } from 'src/application/use-cases/update-nombre-familia.use-case';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Module({
  controllers: [FamiliaController],
  providers: [
    {
      provide: CUENTA_ASOCIADA_REPOSITORY,
      useClass: CuentaAsociadaPrismaRepository,
    },
    {
      provide: FAMILIA_REPOSITORY,
      useClass: FamiliaPrismaRepository,
    },
    CuentaAsociadaService,
    FamiliaService,
    GetCuentasFamiliaresUseCase,
    GetDetalleCuentaFamiliarUseCase,
    UpdateAliasCuentaFamiliarUseCase,
    DeleteCuentaFamiliarUseCase,
    GetMiFamiliaUseCase,
    UpdateNombreFamiliaUseCase,
    PrismaService,
  ],
})
export class FamiliaModule {}
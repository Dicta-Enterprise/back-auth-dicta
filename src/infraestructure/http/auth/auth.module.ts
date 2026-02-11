import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';
import { SharedModule } from 'src/shared/shared.module';

import { USUARIO_REPOSITORY } from 'src/core/constants/constants';
import { UsuarioPrismaRepository } from 'src/infraestructure/persistence/usuarios/usuario.prisma.repository';

import { UsuariosService } from 'src/core/services/usuarios/usuarios.service';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user.use-case';
import { AuthController } from './auth.controller';

@Module({
  imports: [SharedModule, PrismaModule],
  controllers: [AuthController],
  providers: [
    {
      provide: USUARIO_REPOSITORY,
      useClass: UsuarioPrismaRepository,
    },
    UsuariosService,
    RegisterUserUseCase,
  ],
})
export class AuthModule {}

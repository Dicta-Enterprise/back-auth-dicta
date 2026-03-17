import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from 'src/core/services/prisma/prisma.module';
import { SharedModule } from 'src/shared/shared.module';

import { USUARIO_REPOSITORY } from 'src/core/constants/constants';
import { UsuarioPrismaRepository } from 'src/infrastructure/persistence/usuarios/usuario.prisma.repository';

import { UsuariosService } from 'src/core/services/usuarios/usuarios.service';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user.use-case';
import { AuthController } from './auth.controller';
import { envs } from 'src/config/envs';
import { LoginUserUseCase } from 'src/application/use-cases/login-user.use-case';
import { AuthService } from 'src/core/services/auth/auth.service';
import { JwtStrategy } from '../../../core/services/auth/jwtStrategy.service';
import { GoogleStrategy } from 'src/core/services/auth/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { GoogleUseCase } from 'src/application/use-cases/google-use.case';
import { LocalStrategy } from 'src/core/services/auth/localStrategy';

@Module({
  imports: [
    SharedModule,
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: envs.jwtSecret,
      signOptions: {
        expiresIn: envs.jwtExpiresIn,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: USUARIO_REPOSITORY,
      useClass: UsuarioPrismaRepository,
    },
    UsuariosService,
    RegisterUserUseCase,
    LoginUserUseCase,
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    GoogleUseCase,
    LocalStrategy
  ],
})
export class AuthModule {}

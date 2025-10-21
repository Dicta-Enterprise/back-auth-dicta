import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CreateUserUseCase } from '../../../application/uses-cases/auth/create-user.use-case'
import { UserService } from '../../../core/services/auth/users.service';
import { UserPrismaRepository } from '../../persistence/auth/user-prisma.repository'
import { USER_REPOSITORY } from '../../../core/repositories/auth/user.repository';
import { PrismaModule } from '../../../core/services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    // Use Cases
    CreateUserUseCase,

    // Domain Services
    UserService,

    // Repositories (inversión de dependencias)
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [CreateUserUseCase, UserService], // Por si se necesitan en otros módulos
})
export class AuthModule {}

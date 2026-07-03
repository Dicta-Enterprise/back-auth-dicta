import { Module } from '@nestjs/common';
import { CursosCompradosController } from './cursos-comprados.controller';
import { GetPurchasedCoursesUseCase } from 'src/application/use-cases/get-purchased-courses.use-case';
import { PrismaModule } from 'src/core/services/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule, // Importamos PrismaModule para tener acceso a PrismaService
  ],
  controllers: [
    CursosCompradosController,
  ],
  providers: [
    GetPurchasedCoursesUseCase,
  ],
})
export class CursosModule {}

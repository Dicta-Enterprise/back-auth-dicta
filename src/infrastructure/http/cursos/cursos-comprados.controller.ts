import { Controller, Get, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/core/services/auth/jwtPayload';
import { CurrentUser } from 'src/shared/decorator/current-user.decorator';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';
import { GetPurchasedCoursesUseCase } from 'src/application/use-cases/get-purchased-courses.use-case';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth/my-courses')
@UseGuards(jwtAuthGuard)
export class CursosCompradosController {
  constructor(private readonly getPurchasedCoursesUseCase: GetPurchasedCoursesUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener IDs de cursos comprados',
    description: 'Devuelve una lista con los IDs de todos los cursos que el usuario autenticado ha adquirido.',
  })
  @ApiResponse({
    status: 200,
    description: 'Cursos adquiridos obtenidos con éxito.',
    schema: {
      example: {
        data: {
          userId: 1,
          totalCursos: 2,
          cursos: ['curso_id_1', 'curso_id_2'],
        },
        message: 'Cursos adquiridos obtenidos con éxito.',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async getMyCourses(@CurrentUser() userPayload: JwtPayload) {
    const userId = Number(userPayload.sub);

    const result = await this.getPurchasedCoursesUseCase.execute(userId);

    if (result.isFailure) {
      throw new HttpException(
        result.error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      data: result.getValue(),
      message: 'Cursos adquiridos obtenidos con éxito.',
    };
  }
}

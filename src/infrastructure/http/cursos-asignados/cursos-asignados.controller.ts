import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCursoAsignadoDto } from 'src/application/dto/create-curso-asignado.dto';
import { ReasignarCursoDto } from 'src/application/dto/reasignar-curso.dto';
import { ListarCuentasDisponiblesDto } from 'src/application/dto/listar-cuentas-disponibles.dto';
import { CreateCursoAsignadoUseCase } from 'src/application/use-cases/create-curso-asignado.use-case';
import { GetCursosPorCuentaUseCase } from 'src/application/use-cases/get-cursos-por-cuenta.use-case';
import { GetCursoAsignadoDetalleUseCase } from 'src/application/use-cases/get-curso-asignado-detalle.use-case';
import { ReasignarCursoAsignadoUseCase } from 'src/application/use-cases/reasignar-curso-asignado.use-case';
import { DeleteCursoAsignadoUseCase } from 'src/application/use-cases/delete-curso-asignado.use-case';
import { ListarCuentasDisponiblesCursoUseCase } from 'src/application/use-cases/listar-cuentas-disponibles-curso.use-case';
import { CurrentUser } from 'src/shared/decorator/current-user.decorator';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';

@ApiTags('Cursos Asignados')
@ApiBearerAuth()
@Controller()
@UseGuards(jwtAuthGuard)
export class CursosAsignadosController {
  constructor(
    private readonly createCursoAsignadoUseCase: CreateCursoAsignadoUseCase,
    private readonly getCursosPorCuentaUseCase: GetCursosPorCuentaUseCase,
    private readonly getCursoAsignadoDetalleUseCase: GetCursoAsignadoDetalleUseCase,
    private readonly reasignarCursoAsignadoUseCase: ReasignarCursoAsignadoUseCase,
    private readonly deleteCursoAsignadoUseCase: DeleteCursoAsignadoUseCase,
    private readonly listarCuentasDisponiblesCursoUseCase: ListarCuentasDisponiblesCursoUseCase,
  ) {}

  @Post('cursos-asignados')
  @ApiOperation({ summary: 'Asignar un curso a una cuenta asociada' })
  @ApiResponse({ status: 201, description: 'Curso asignado con éxito.' })
  @ApiResponse({ status: 400, description: 'El curso ya está asignado a esta cuenta, el tipo no coincide, la cuenta no está ACTIVA o no es del padre autenticado.' })
  async crear(@Body() dto: CreateCursoAsignadoDto, @CurrentUser() user) {
    const idPadre = Number(user.sub);
    const result = await this.createCursoAsignadoUseCase.execute(dto, idPadre);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { data: result.getValue(), message: 'Curso asignado con éxito.' };
  }

  @Get('cursos-asignados/cuentas-disponibles')
  @ApiOperation({ summary: 'Listar las cuentas asociadas del padre autenticado disponibles para recibir un curso de un tipo determinado' })
  @ApiResponse({ status: 200, description: 'Cuentas disponibles obtenidas con éxito.' })
  async cuentasDisponibles(@Query() query: ListarCuentasDisponiblesDto, @CurrentUser() user) {
    const idPadre = Number(user.sub);
    const result = await this.listarCuentasDisponiblesCursoUseCase.execute(idPadre, query.tipoCurso);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { data: result.getValue(), message: 'Cuentas disponibles obtenidas con éxito.' };
  }

  @Get('cuentas-asociadas/:id/cursos')
  @ApiOperation({ summary: 'Obtener los cursos asignados a una cuenta asociada' })
  @ApiResponse({ status: 200, description: 'Cursos obtenidos con éxito.' })
  async obtenerPorCuenta(@Param('id', ParseIntPipe) id: number) {
    const result = await this.getCursosPorCuentaUseCase.execute(id);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { data: result.getValue(), message: 'Cursos obtenidos con éxito.' };
  }

  @Get('cursos-asignados/:id')
  @ApiOperation({ summary: 'Obtener el detalle de un curso asignado' })
  @ApiResponse({ status: 200, description: 'Detalle obtenido con éxito.' })
  @ApiResponse({ status: 404, description: 'Curso asignado no encontrado.' })
  async obtenerDetalle(@Param('id', ParseIntPipe) id: number) {
    const result = await this.getCursoAsignadoDetalleUseCase.execute(id);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
    }
    return { data: result.getValue(), message: 'Detalle obtenido con éxito.' };
  }

  @Patch('cursos-asignados/:id/reasignar')
  @ApiOperation({ summary: 'Reasignar un curso a otra cuenta asociada' })
  @ApiResponse({ status: 200, description: 'Curso reasignado con éxito.' })
  @ApiResponse({ status: 404, description: 'Curso asignado no encontrado.' })
  @ApiResponse({ status: 400, description: 'La cuenta destino ya tiene este curso asignado.' })
  async reasignar(@Param('id', ParseIntPipe) id: number, @Body() dto: ReasignarCursoDto) {
    const result = await this.reasignarCursoAsignadoUseCase.execute(id, dto);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { data: result.getValue(), message: 'Curso reasignado con éxito.' };
  }

  @Delete('cursos-asignados/:id')
  @ApiOperation({ summary: 'Eliminar la asignación de un curso' })
  @ApiResponse({ status: 200, description: 'Asignación eliminada con éxito.' })
  @ApiResponse({ status: 404, description: 'Curso asignado no encontrado.' })
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    const result = await this.deleteCursoAsignadoUseCase.execute(id);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
    }
    return { data: result.getValue(), message: 'Asignación eliminada con éxito.' };
  }
}


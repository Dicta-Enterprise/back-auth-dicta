import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateAliasCuentaAsociadaDto } from 'src/application/dto/update-alias-cuenta-asociada.dto';
import { GetCuentasFamiliaresUseCase } from 'src/application/use-cases/get-cuentas-familiares.use-case';
import { GetDetalleCuentaFamiliarUseCase } from 'src/application/use-cases/get-detalle-cuenta-familiar.use-case';
import { UpdateAliasCuentaFamiliarUseCase } from 'src/application/use-cases/update-alias-cuenta-familiar.use-case';
import { DeleteCuentaFamiliarUseCase } from 'src/application/use-cases/delete-cuenta-familiar.use-case';
import { DesactivarCuentaAsociadaUseCase } from 'src/application/use-cases/desactivar-cuenta-asociada.use-case';
import { ReactivarCuentaAsociadaUseCase } from 'src/application/use-cases/reactivar-cuenta-asociada.use-case';
import { CurrentUser } from 'src/shared/decorator/current-user.decorator';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';
import { CreateCuentaAsociadaDto } from 'src/application/dto/create-cuenta-asociada.dto';
import { CreateCuentaAsociadaUseCase } from 'src/application/use-cases/create-cuenta-asociada.use-case';


@ApiTags('Cuentas Asociadas')
@ApiBearerAuth()
@Controller('cuentas-asociadas')
@UseGuards(jwtAuthGuard)
export class CuentasAsociadasController {
  constructor(
    private readonly getCuentasFamiliaresUseCase: GetCuentasFamiliaresUseCase,
    private readonly getDetalleCuentaFamiliarUseCase: GetDetalleCuentaFamiliarUseCase,
    private readonly updateAliasCuentaFamiliarUseCase: UpdateAliasCuentaFamiliarUseCase,
    private readonly deleteCuentaFamiliarUseCase: DeleteCuentaFamiliarUseCase,
    private readonly desactivarCuentaAsociadaUseCase: DesactivarCuentaAsociadaUseCase,
    private readonly reactivarCuentaAsociadaUseCase: ReactivarCuentaAsociadaUseCase,
    private readonly createCuentaAsociadaUseCase: CreateCuentaAsociadaUseCase,

  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear invitación de cuenta asociada', description: 'Crea una invitación para asociar una cuenta familiar. El destinatario debe aceptarla para quedar asociado.' })
  @ApiResponse({ status: 201, description: 'Invitación creada con éxito.' })
  @ApiResponse({ status: 400, description: 'El correo ya tiene una invitación asociada.' })
  async crear(@Body() dto: CreateCuentaAsociadaDto, @CurrentUser() user) {
    const idPadre = Number(user.sub);
    const result = await this.createCuentaAsociadaUseCase.execute(dto, idPadre);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { data: result.getValue(), message: 'Invitación creada con éxito.' };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener cuentas asociadas', description: 'Obtiene todas las cuentas asociadas pertenecientes al padre autenticado.' })
  @ApiResponse({ status: 200, description: 'Cuentas asociadas obtenidas con éxito.' })
  async obtenerCuentas(@CurrentUser() user) {
    const idPadre = Number(user.sub);
    const result = await this.getCuentasFamiliaresUseCase.execute(idPadre);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { data: result.getValue(), message: 'Cuentas asociadas obtenidas con éxito.' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de cuenta asociada' })
  @ApiResponse({ status: 200, description: 'Detalle obtenido con éxito.' })
  @ApiResponse({ status: 404, description: 'Cuenta asociada no encontrada o no autorizada.' })
  async obtenerDetalle(@Param('id', ParseIntPipe) id: number, @CurrentUser() user) {
    const idPadre = Number(user.sub);
    const result = await this.getDetalleCuentaFamiliarUseCase.execute(id, idPadre);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
    }
    return { data: result.getValue(), message: 'Detalle obtenido con éxito.' };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar cuenta asociada' })
  @ApiResponse({ status: 200, description: 'Actualizada con éxito.' })
  @ApiResponse({ status: 404, description: 'Cuenta asociada no encontrada o no autorizada.' })
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAliasCuentaAsociadaDto,
    @CurrentUser() user,
  ) {
    const idPadre = Number(user.sub);
    const result = await this.updateAliasCuentaFamiliarUseCase.execute(id, idPadre, dto);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
    }
    return { data: result.getValue(), message: 'Actualizada con éxito.' };
  }

  @Patch(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar cuenta asociada' })
  @ApiResponse({ status: 200, description: 'Cuenta desactivada con éxito.' })
  @ApiResponse({ status: 404, description: 'Cuenta asociada no encontrada o no autorizada.' })
  async desactivar(@Param('id', ParseIntPipe) id: number, @CurrentUser() user) {
    const idPadre = Number(user.sub);
    const result = await this.desactivarCuentaAsociadaUseCase.execute(id, idPadre);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
    }
    return { data: result.getValue(), message: 'Cuenta desactivada con éxito.' };
  }

  @Patch(':id/reactivar')
  @ApiOperation({ summary: 'Reactivar cuenta asociada' })
  @ApiResponse({ status: 200, description: 'Cuenta reactivada con éxito.' })
  @ApiResponse({ status: 404, description: 'Cuenta asociada no encontrada o no autorizada.' })
  async reactivar(@Param('id', ParseIntPipe) id: number, @CurrentUser() user) {
    const idPadre = Number(user.sub);
    const result = await this.reactivarCuentaAsociadaUseCase.execute(id, idPadre);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
    }
    return { data: result.getValue(), message: 'Cuenta reactivada con éxito.' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar relación de cuenta asociada' })
  @ApiResponse({ status: 200, description: 'Relación eliminada con éxito.' })
  @ApiResponse({ status: 404, description: 'Cuenta asociada no encontrada o no autorizada.' })
  async eliminar(@Param('id', ParseIntPipe) id: number, @CurrentUser() user) {
    const idPadre = Number(user.sub);
    const result = await this.deleteCuentaFamiliarUseCase.execute(id, idPadre);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
    }
    return { data: result.getValue(), message: 'Relación eliminada con éxito.' };
  }
}

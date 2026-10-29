import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateAliasCuentaAsociadaDto } from 'src/application/dto/update-alias-cuenta-asociada.dto';
import { UpdateNombreFamiliaDto } from 'src/application/dto/update-nombre-familia.dto';
import { DeleteCuentaFamiliarUseCase } from 'src/application/use-cases/delete-cuenta-familiar.use-case';
import { GetCuentasFamiliaresUseCase } from 'src/application/use-cases/get-cuentas-familiares.use-case';
import { GetDetalleCuentaFamiliarUseCase } from 'src/application/use-cases/get-detalle-cuenta-familiar.use-case';
import { GetMiFamiliaUseCase } from 'src/application/use-cases/get-mi-familia.use-case';
import { UpdateAliasCuentaFamiliarUseCase } from 'src/application/use-cases/update-alias-cuenta-familiar.use-case';
import { UpdateNombreFamiliaUseCase } from 'src/application/use-cases/update-nombre-familia.use-case';
import { CurrentUser } from 'src/shared/decorator/current-user.decorator';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';

@ApiTags('Familia')
@ApiBearerAuth()
@Controller('familia')
@UseGuards(jwtAuthGuard)
export class FamiliaController {
  constructor(
    private readonly getCuentasFamiliaresUseCase: GetCuentasFamiliaresUseCase,
    private readonly getDetalleCuentaFamiliarUseCase: GetDetalleCuentaFamiliarUseCase,
    private readonly updateAliasCuentaFamiliarUseCase: UpdateAliasCuentaFamiliarUseCase,
    private readonly deleteCuentaFamiliarUseCase: DeleteCuentaFamiliarUseCase,
    private readonly getMiFamiliaUseCase: GetMiFamiliaUseCase,
    private readonly updateNombreFamiliaUseCase: UpdateNombreFamiliaUseCase,
  ) {}

  @Get('info')
  @ApiOperation({ summary: 'Obtener datos de mi familia', description: 'Obtiene el id, nombre y fecha de creación de la familia del padre autenticado.' })
  @ApiResponse({ status: 200, description: 'Datos de la familia obtenidos con éxito.' })
  @ApiResponse({ status: 404, description: 'Aún no tienes una familia creada.' })
  async obtenerInfo(@CurrentUser() user) {
    const idPadre = Number(user.sub);

    const result = await this.getMiFamiliaUseCase.execute(idPadre);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
    }

    return {
      data: result.getValue(),
      message: 'Datos de la familia obtenidos con éxito.',
    };
  }

  @Patch('nombre')
  @ApiOperation({ summary: 'Renombrar mi familia', description: 'Actualiza el nombre de la familia del padre autenticado.' })
  @ApiResponse({ status: 200, description: 'Nombre de la familia actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Aún no tienes una familia creada.' })
  async actualizarNombreFamilia(@Body() dto: UpdateNombreFamiliaDto, @CurrentUser() user) {
    const idPadre = Number(user.sub);

    const result = await this.updateNombreFamiliaUseCase.execute(idPadre, dto);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
    }

    return {
      data: result.getValue(),
      message: 'Nombre de la familia actualizado con éxito.',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener cuentas familiares', description: 'Obtiene todas las cuentas familiares asociadas al padre autenticado.' })
  @ApiResponse({ status: 200, description: 'Cuentas familiares obtenidas con éxito.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  async obtenerCuentas(@CurrentUser() user) {
    const idPadre = Number(user.sub);

    const result = await this.getCuentasFamiliaresUseCase.execute(idPadre);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }

    return {
      data: result.getValue(),
      message: 'Cuentas familiares obtenidas con éxito.',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de cuenta familiar', description: 'Obtiene el detalle de una cuenta familiar específica validando que pertenezca al padre autenticado.' })
  @ApiResponse({ status: 200, description: 'Detalle de cuenta familiar obtenido con éxito.' })
  @ApiResponse({ status: 404, description: 'Cuenta familiar no encontrada o no autorizada.' })
  async obtenerDetalle(@Param('id', ParseIntPipe) id: number, @CurrentUser() user) {
    const idPadre = Number(user.sub);

    const result = await this.getDetalleCuentaFamiliarUseCase.execute(id, idPadre);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
    }

    return {
      data: result.getValue(),
      message: 'Detalle de cuenta familiar obtenido con éxito.',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar alias de cuenta familiar', description: 'Actualiza el alias de una cuenta familiar asociada.' })
  @ApiResponse({ status: 200, description: 'Alias actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Cuenta familiar no encontrada o no autorizada.' })
  async actualizarAlias(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAliasCuentaAsociadaDto,
    @CurrentUser() user,
  ) {
    const idPadre = Number(user.sub);

    const result = await this.updateAliasCuentaFamiliarUseCase.execute(id, idPadre, dto);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
    }

    return {
      data: result.getValue(),
      message: 'Alias actualizado con éxito.',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar relación de cuenta familiar', description: 'Elimina únicamente la relación en cuenta_asociada sin borrar la cuenta del usuario hijo.' })
  @ApiResponse({ status: 200, description: 'Relación de cuenta familiar eliminada con éxito.' })
  @ApiResponse({ status: 404, description: 'Cuenta familiar no encontrada o no autorizada.' })
  async eliminarRelacion(@Param('id', ParseIntPipe) id: number, @CurrentUser() user) {
    const idPadre = Number(user.sub);

    const result = await this.deleteCuentaFamiliarUseCase.execute(id, idPadre);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
    }

    return {
      data: result.getValue(),
      message: 'Relación de cuenta familiar eliminada con éxito.',
    };
  }
}
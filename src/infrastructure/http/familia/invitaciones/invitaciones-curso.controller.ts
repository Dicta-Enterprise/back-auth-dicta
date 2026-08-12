import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AceptarInvitacionCursoDto } from 'src/application/dto/aceptar-invitacion-curso.dto';
import { EnviarInvitacionCursoDto } from 'src/application/dto/enviar-invitacion-curso.dto';
import { AceptarInvitacionCursoUseCase } from 'src/application/use-cases/aceptar-invitacion-curso.use-case';
import { CancelarInvitacionCursoUseCase } from 'src/application/use-cases/cancelar-invitacion-curso.use-case';
import { EnviarInvitacionCursoUseCase } from 'src/application/use-cases/enviar-invitacion-curso.use-case';
import { GetDetalleInvitacionCursoUseCase } from 'src/application/use-cases/get-detalle-invitacion-curso.use-case';
import { GetInvitacionesCursoUseCase } from 'src/application/use-cases/get-invitaciones-curso.use-case';
import { ReenviarInvitacionCursoUseCase } from 'src/application/use-cases/reenviar-invitacion-curso.use-case';
import { ValidarTokenInvitacionCursoUseCase } from 'src/application/use-cases/validar-token-invitacion-curso.use-case';
import { CurrentUser } from 'src/shared/decorator/current-user.decorator';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';

@ApiTags('Invitaciones Familiares')
@Controller('familia/invitaciones')
export class InvitacionesCursoController {
  constructor(
    private readonly enviarInvitacionUseCase: EnviarInvitacionCursoUseCase,
    private readonly reenviarInvitacionUseCase: ReenviarInvitacionCursoUseCase,
    private readonly cancelarInvitacionUseCase: CancelarInvitacionCursoUseCase,
    private readonly getInvitacionesUseCase: GetInvitacionesCursoUseCase,
    private readonly getDetalleInvitacionUseCase: GetDetalleInvitacionCursoUseCase,
    private readonly validarTokenUseCase: ValidarTokenInvitacionCursoUseCase,
    private readonly aceptarInvitacionUseCase: AceptarInvitacionCursoUseCase,
  ) {}

  @Post()
  @UseGuards(jwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enviar invitación', description: 'Envía una invitación de curso para una cuenta asociada existente del padre autenticado.' })
  @ApiResponse({ status: 201, description: 'Invitación enviada con éxito.' })
  @ApiResponse({ status: 400, description: 'Cuenta asociada no encontrada o no autorizada.' })
  async enviar(@Body() dto: EnviarInvitacionCursoDto, @CurrentUser() user) {
    const idPadre = Number(user.sub);
    const result = await this.enviarInvitacionUseCase.execute(dto, idPadre);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { data: result.getValue(), message: 'Invitación enviada con éxito.' };
  }

  @Post(':id/reenviar')
  @UseGuards(jwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reenviar invitación', description: 'Genera un nuevo token, actualiza la fecha de expiración y reenvía el correo de invitación.' })
  @ApiResponse({ status: 201, description: 'Invitación reenviada con éxito.' })
  @ApiResponse({ status: 400, description: 'Invitación no encontrada, no autorizada o no está pendiente.' })
  async reenviar(@Param('id') id: string, @CurrentUser() user) {
    const idPadre = Number(user.sub);
    const result = await this.reenviarInvitacionUseCase.execute(id, idPadre);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { data: result.getValue(), message: 'Invitación reenviada con éxito.' };
  }

  @Patch(':id/cancelar')
  @UseGuards(jwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar invitación', description: 'Cambia el estado de la invitación a CANCELADA.' })
  @ApiResponse({ status: 200, description: 'Invitación cancelada con éxito.' })
  @ApiResponse({ status: 400, description: 'Invitación no encontrada, no autorizada o no está pendiente.' })
  async cancelar(@Param('id') id: string, @CurrentUser() user) {
    const idPadre = Number(user.sub);
    const result = await this.cancelarInvitacionUseCase.execute(id, idPadre);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { data: result.getValue(), message: 'Invitación cancelada con éxito.' };
  }

  @Get()
  @UseGuards(jwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar invitaciones', description: 'Obtiene todas las invitaciones de curso del padre autenticado.' })
  @ApiResponse({ status: 200, description: 'Invitaciones obtenidas con éxito.' })
  async listar(@CurrentUser() user) {
    const idPadre = Number(user.sub);
    const result = await this.getInvitacionesUseCase.execute(idPadre);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { data: result.getValue(), message: 'Invitaciones obtenidas con éxito.' };
  }

  @Get('validar/:token')
  @ApiOperation({ summary: 'Validar token de invitación', description: 'Endpoint público. Valida el estado y la vigencia del token y retorna la información necesaria para el formulario de registro.' })
  @ApiResponse({ status: 200, description: 'Token válido.' })
  @ApiResponse({ status: 400, description: 'Token inválido, expirado o no disponible.' })
  async validarToken(@Param('token') token: string) {
    const result = await this.validarTokenUseCase.execute(token);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { data: result.getValue(), message: 'Token válido.' };
  }

  @Get(':id')
  @UseGuards(jwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener detalle de invitación', description: 'Obtiene el detalle de una invitación específica del padre autenticado.' })
  @ApiResponse({ status: 200, description: 'Detalle obtenido con éxito.' })
  @ApiResponse({ status: 400, description: 'Invitación no encontrada o no autorizada.' })
  async detalle(@Param('id') id: string, @CurrentUser() user) {
    const idPadre = Number(user.sub);
    const result = await this.getDetalleInvitacionUseCase.execute(id, idPadre);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { data: result.getValue(), message: 'Detalle obtenido con éxito.' };
  }

  @Post('aceptar')
  @ApiOperation({ summary: 'Aceptar invitación', description: 'Endpoint público. Crea el usuario, lo asocia a la cuenta familiar y marca la invitación como ACEPTADA.' })
  @ApiResponse({ status: 201, description: 'Invitación aceptada con éxito.' })
  @ApiResponse({ status: 400, description: 'Token inválido, expirado, no disponible o datos inválidos.' })
  async aceptar(@Body() dto: AceptarInvitacionCursoDto) {
    const result = await this.aceptarInvitacionUseCase.execute(dto);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return { data: result.getValue(), message: 'Invitación aceptada con éxito.' };
  }
}

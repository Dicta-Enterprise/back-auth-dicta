import { Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DetectarUbicacionUsuarioUseCase } from 'src/application/use-cases/detectar-ubicacion-usuario.use-case';
import { GetUbicacionUsuarioUseCase } from 'src/application/use-cases/get-ubicacion-usuario.use-case';
import { JwtPayload } from 'src/core/services/auth/jwtPayload';
import { ClientIp } from 'src/shared/decorator/client-ip.decorator';
import { CurrentUser } from 'src/shared/decorator/current-user.decorator';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';
import { UbicacionUsuario } from 'src/core/entities/ubicacion-usuario/ubicacion-usuario.entity';

function toResponse(ubicacion: UbicacionUsuario) {
  return {
    pais: ubicacion.pais ?? null,
    ciudad: ubicacion.ciudad,
    zonaHoraria: ubicacion.zonaHoraria,
  };
}

@ApiTags('Perfil - Ubicación')
@ApiBearerAuth()
@Controller('perfil')
@UseGuards(jwtAuthGuard)
export class UbicacionUsuarioController {
  constructor(
    private readonly getUbicacionUsuarioUseCase: GetUbicacionUsuarioUseCase,
    private readonly detectarUbicacionUsuarioUseCase: DetectarUbicacionUsuarioUseCase,
  ) {}

  @Get('ubicacion')
  @ApiOperation({ summary: 'Obtener la ubicación registrada del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Ubicación obtenida con éxito.' })
  @ApiResponse({ status: 404, description: 'El usuario no tiene una ubicación registrada.' })
  async obtener(@CurrentUser() user: JwtPayload) {
    const idusuario = Number(user.sub);
    const result = await this.getUbicacionUsuarioUseCase.execute(idusuario);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
    }
    return toResponse(result.getValue());
  }

  @Post('ubicacion/detectar')
  @ApiOperation({ summary: 'Detectar y actualizar la ubicación del usuario autenticado a partir de la IP de la petición' })
  @ApiResponse({ status: 201, description: 'Ubicación detectada y guardada con éxito.' })
  @ApiResponse({ status: 400, description: 'No fue posible determinar la ubicación a partir de la IP.' })
  async detectar(@CurrentUser() user: JwtPayload, @ClientIp() ip: string | null) {
    const idusuario = Number(user.sub);
    const result = await this.detectarUbicacionUsuarioUseCase.execute(idusuario, ip);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    return toResponse(result.getValue());
  }
}

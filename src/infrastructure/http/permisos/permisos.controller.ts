import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AsignarPermisosDto } from 'src/application/dto/asignar-permisos.dto';
import { CreatePermisoDto } from 'src/application/dto/create-permiso.dto';
import { DetallePermisoService } from 'src/core/services/detalle-permiso/detalle-permiso.service';
import { PermisoService } from 'src/core/services/permiso/permiso.service';
import { CurrentUser } from 'src/shared/decorator/current-user.decorator';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';

@ApiTags('Permisos')
@ApiBearerAuth()
@UseGuards(jwtAuthGuard)
@Controller('permisos')
export class PermisosController {
  constructor(
    private readonly permisoService: PermisoService,
    private readonly detallePermisoService: DetallePermisoService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo permiso' })
  async crearPermiso(@Body() dto: CreatePermisoDto, @CurrentUser() user) {
    if (user?.idrol !== 1) {
      throw new HttpException('Necesitas permisos de administrador', HttpStatus.FORBIDDEN);
    }
    const permiso = await this.permisoService.crearPermiso(dto);
    return { data: permiso, message: 'Permiso creado exitosamente' };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los permisos' })
  async obtenerPermisos() {
    const permisos = await this.permisoService.obtenerTodosPermisos();
    return { data: permisos, message: 'Permisos obtenidos exitosamente' };
  }

  @Post('asignar')
  @ApiOperation({ summary: 'Asignar permisos a un rol' })
  async asignarPermisos(@Body() dto: AsignarPermisosDto, @CurrentUser() user) {
    if (user?.idrol !== 1) {
      throw new HttpException('Necesitas permisos de administrador', HttpStatus.FORBIDDEN);
    }
    const resultado = await this.detallePermisoService.asignarPermisosARol(dto.idRol, dto.permisosIds);
    return {
      data: resultado,
      message: `Permisos asignados: ${resultado.asignados.length}, ya existían: ${resultado.existentes.length}, errores: ${resultado.errores.length}`,
    };
  }

  @Put('reemplazar')
  @ApiOperation({ summary: 'Reemplazar todos los permisos de un rol' })
  async reemplazarPermisos(@Body() dto: AsignarPermisosDto, @CurrentUser() user) {
    if (user?.idrol !== 1) {
      throw new HttpException('Necesitas permisos de administrador', HttpStatus.FORBIDDEN);
    }
    await this.detallePermisoService.reemplazarPermisosDeRol(dto.idRol, dto.permisosIds);
    return { message: `Permisos del rol ${dto.idRol} reemplazados exitosamente` };
  }

  @Get('rol/:idRol')
  @ApiOperation({ summary: 'Obtener permisos de un rol' })
  async obtenerPermisosPorRol(@Param('idRol') idRol: string) {
    const permisos = await this.detallePermisoService.obtenerPermisosPorRol(parseInt(idRol));
    return { data: permisos, message: 'Permisos obtenidos correctamente' };
  }

  @Delete('rol/:idRol/permiso/:idPermiso')
  @ApiOperation({ summary: 'Eliminar un permiso de un rol' })
  async eliminarPermisoDeRol(
    @Param('idRol') idRol: string,
    @Param('idPermiso') idPermiso: string,
    @CurrentUser() user,
  ) {
    if (user?.idrol !== 1) {
      throw new HttpException('Necesitas permisos de administrador', HttpStatus.FORBIDDEN);
    }
    await this.detallePermisoService.eliminarPermisoDeRol(parseInt(idRol), parseInt(idPermiso));
    return { message: 'Permiso eliminado del rol correctamente' };
  }
}
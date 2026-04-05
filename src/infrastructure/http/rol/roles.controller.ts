import { Body, Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateRolDto } from 'src/application/dto/create-rol.dto';
import { CreateRolUseCase } from 'src/application/use-cases/create-rol.use-case';
import { RegistrarRolesBaseUseCase } from 'src/application/use-cases/registrar-roles-base.use-case';
import { CurrentUser } from 'src/shared/decorator/current-user.decorator';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';
import { RolService } from 'src/core/services/rol/rol.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(
    private readonly createUseCase: CreateRolUseCase,
    private readonly registrarRolesBaseUseCase: RegistrarRolesBaseUseCase,
    private readonly rolService: RolService,
  ) {}

  @Post()
  @UseGuards(jwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crea un nuevo rol (Solo administradores)' })
  @ApiBody({ type: CreateRolDto })
  @ApiResponse({ status: 201, description: 'Rol creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 403, description: 'Sin permisos de administrador.' })
  async create(@Body() dto: CreateRolDto, @CurrentUser() user) {
    if (user?.idrol !== 1) {
      throw new HttpException('Necesitas permisos de administrador para realizar esta acción', HttpStatus.FORBIDDEN);
    }
    
    const result = await this.createUseCase.execute(dto);
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    
    const rol = result.getValue();
    return {
      data: {
        id: rol.id,
        nombreRol: rol.nombreRol,
        descripcion: rol.descripcion,
        tipo: rol.tipo,
        estado: rol.estado,
      },
      message: 'Rol creado con éxito.'
    };
  }

  @Post('registrar-base')
  @ApiOperation({ summary: 'Registra los roles base del sistema (Trabajador, Cliente, Administrador)' })
  @ApiResponse({ status: 200, description: 'Proceso completado.' })
  @ApiResponse({ status: 201, description: 'Roles creados por primera vez.' })
  @ApiResponse({ status: 400, description: 'Error al registrar roles.' })
  async registrarRolesBase() {
    const result = await this.registrarRolesBaseUseCase.execute();
    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
    }
    
    const { creados, existentes, todos, mensaje } = result.getValue();
    
    // Determinar el código de estado HTTP
    const statusCode = creados.length > 0 && existentes.length === 0 ? HttpStatus.CREATED : HttpStatus.OK;
    
    return {
      data: {
        roles: todos.map(rol => ({
          id: rol.id,
          nombreRol: rol.nombreRol,
          descripcion: rol.descripcion,
          tipo: rol.tipo,
          estado: rol.estado,
        })),
        resumen: {
          creados: creados.length,
          existentes: existentes.length,
          total: todos.length
        }
      },
      message: mensaje
    };
  }

  @Get()
  @UseGuards(jwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtiene todos los roles' })
  @ApiResponse({ status: 200, description: 'Lista de roles obtenida con éxito.' })
  async findAll() {
    const roles = await this.rolService.obtenerTodosLosRoles();
    return {
      data: roles.map(rol => ({
        id: rol.id,
        nombreRol: rol.nombreRol,
        descripcion: rol.descripcion,
        tipo: rol.tipo,
        estado: rol.estado,
      })),
      message: 'Roles obtenidos con éxito.'
    };
  }
}
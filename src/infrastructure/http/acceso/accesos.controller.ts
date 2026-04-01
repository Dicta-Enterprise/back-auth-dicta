import { Body, Controller, ForbiddenException, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAccesoDto } from 'src/application/dto/create-acceso.dto';
import { CreateAccesoUseCase } from 'src/application/use-cases/create-acceso.use-case';
import { CurrentUser } from 'src/shared/decorator/current-user.decorator';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';

@ApiTags('Control de Accesos')
@ApiBearerAuth()
@UseGuards(jwtAuthGuard)
@Controller('permissions')
export class AccesosController {
    constructor(private readonly createUseCase: CreateAccesoUseCase) {}
    @Post()
    @UseGuards(jwtAuthGuard)
    @ApiOperation({ summary: 'Crea un nuevo acceso (Solo administradores)' })
    @ApiResponse({ status: 201, description: 'Acceso creado con éxito.' })
    async create(@Body() dto: CreateAccesoDto, @CurrentUser() user){
        if (user.idrol !== 1) {
        throw new ForbiddenException('Necesitas permisos de administrador para realizar esta acción');
        }
        const result = await this.createUseCase.execute(dto);
        if (result.isFailure) {
            throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
        }
        const acceso = result.getValue();
        return{
            data: {
                codigo: acceso.codigo,
                descripcion: acceso.descripcion
            },
            message: 'Acceso creado con éxito.'
        }
    }
}
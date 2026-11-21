import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InternalApiKeyGuard } from 'src/shared/guard/internalApiKey.guard';
import { GetUserByIdUseCase } from 'src/application/use-cases/get-user-by-id.use-case';
import { ListarFamiliasInternoUseCase } from 'src/application/use-cases/listar-familias-interno.use-case';
import { GetFamiliaInternoUseCase } from 'src/application/use-cases/get-familia-interno.use-case';
import { ListarUsuariosInternoUseCase } from 'src/application/use-cases/listar-usuarios-interno.use-case';
import { ListarUsuariosInternoDto } from 'src/application/dto/listar-usuarios-interno.dto';

@ApiTags('Internal')
@ApiHeader({ name: 'x-internal-api-key', required: true, description: 'Clave compartida entre los servicios de Dicta.' })
@UseGuards(InternalApiKeyGuard)
@Controller('internal')
export class InternalController {
  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly listarFamiliasInternoUseCase: ListarFamiliasInternoUseCase,
    private readonly getFamiliaInternoUseCase: GetFamiliaInternoUseCase,
    private readonly listarUsuariosInternoUseCase: ListarUsuariosInternoUseCase,
  ) {}

  @Get('usuarios')
  @ApiOperation({
    summary: 'Listar los usuarios de la LMS (padres, niños y jóvenes) con filtros y paginación (uso interno)',
  })
  async listarUsuarios(@Query() query: ListarUsuariosInternoDto) {
    const result = await this.listarUsuariosInternoUseCase.execute(query);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result.getValue();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Obtener usuario por ID (uso interno)' })
  async getUser(@Param('id') id: number) {
    const usuario = await this.getUserByIdUseCase.execute(Number(id));

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado en auth');
    }

    return usuario;
  }

  @Get('familias')
  @ApiOperation({ summary: 'Listar todas las familias con sus miembros (uso interno)' })
  async listarFamilias() {
    const result = await this.listarFamiliasInternoUseCase.execute();

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result.getValue();
  }

  @Get('familias/padre/:idpadre')
  @ApiOperation({ summary: 'Obtener la familia de un padre con sus miembros (uso interno)' })
  async getFamiliaPorPadre(@Param('idpadre', ParseIntPipe) idpadre: number) {
    const result = await this.getFamiliaInternoUseCase.execute(idpadre);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
    }

    return result.getValue();
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
import { GeolocalizarIpDto } from 'src/application/dto/geolocalizar-ip.dto';
import { GeolocalizarIpUseCase } from 'src/application/use-cases/geolocalizar-ip.use-case';
import { ActualizarTipoUsuarioFamiliaDto } from 'src/application/dto/actualizar-tipo-usuario-familia.dto';
import { ActualizarTipoUsuarioFamiliaUseCase } from 'src/application/use-cases/actualizar-tipo-usuario-familia.use-case';

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
    private readonly geolocalizarIpUseCase: GeolocalizarIpUseCase,
    private readonly actualizarTipoUsuarioFamiliaUseCase: ActualizarTipoUsuarioFamiliaUseCase,
  ) {}

  // POST y no GET: la IP es un dato personal y así no queda escrita en la URL ni en los registros de acceso.
  @Post('geolocalizar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener país, ciudad y zona horaria de una IP, sin guardar nada (uso interno)' })
  geolocalizar(@Body() dto: GeolocalizarIpDto) {
    const result = this.geolocalizarIpUseCase.execute(dto.ip);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result.getValue();
  }

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

  @Put('familias/padre/:idpadre/tipo-usuario')
  @ApiOperation({
    summary: 'Marcar la familia de un padre como FREE o PREMIUM según sus compras (lo llama back-transaction)',
  })
  async actualizarTipoUsuario(
    @Param('idpadre', ParseIntPipe) idpadre: number,
    @Body() dto: ActualizarTipoUsuarioFamiliaDto,
  ) {
    const result = await this.actualizarTipoUsuarioFamiliaUseCase.execute(idpadre, dto.tipoUsuario);

    if (result.isFailure) {
      throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
    }

    const familia = result.getValue();
    return { idpadre: familia.idpadre, tipoUsuario: familia.tipoUsuario };
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

import {
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUserByIdUseCase } from 'src/application/use-cases/get-user-by-id.use-case';

@ApiTags('Internal')
@Controller('internal')
export class InternalController {
  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Get('users/:id')
  @ApiOperation({ summary: 'Obtener usuario por ID (uso interno)' })
  async getUser(@Param('id') id: number) {
    const usuario = await this.getUserByIdUseCase.execute(Number(id));

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado en auth');
    }

    return usuario;
  }
}
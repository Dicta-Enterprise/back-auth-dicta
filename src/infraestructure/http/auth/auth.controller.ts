import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../../../application/dto/auth/create-user.dto'
import { CreateUserUseCase } from '../../../application/uses-cases/auth/create-user.use-case';
import { GenericSingle } from 'src/shared/class/Generic.Class';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

interface UserResponse {
  id: number;
  username: string;
  email: string;
  estado: number;
  fechadecreacion: Date;
}

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post('register')
  @ApiOperation({
    summary: 'Crear nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema con email y contraseña',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Email o username ya existe',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async register(
    @Body() registerDto: CreateUserDto,
  ): Promise<GenericSingle<UserResponse>> {
    // Ejecutar use case
    const result = await this.createUserUseCase.execute(registerDto);

    // Manejar resultado
    if (result.isFailure) {
      const error = result.error as BussinesRuleException;
      throw new HttpException(
        {
          status: error.errorCode || 500,
          message: error.message,
          details: error.details,
        },
        error.errorCode || 500,
      );
    }

    // Mapear a respuesta usando método de la entidad
    const user = result.getValue();
    const userResponse = user.toResponse(); // Este método ya devuelve objeto sin password

    // Retornar con formato GenericSingle del proyecto
    return new GenericSingle(
      userResponse,
      HttpStatus.CREATED,
      'Usuario registrado exitosamente',
    );
  }
}
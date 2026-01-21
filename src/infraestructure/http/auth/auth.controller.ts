import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import * as useCase from 'src/application/use-cases/register-user.use-case';
import * as dto from 'src/application/dto/register-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
            private registerUseCase: useCase.RegisterUserUseCase
    ) {}
    
    @Post('register')
    @ApiOperation({ summary: 'Registrar un usuario' })
    @ApiBody({ type: dto.RegisterUserDto })
    @ApiResponse({ status: 201, description: 'Usuario registrado correctamente' })
    @ApiResponse({ status: 400, description: 'Datos inválidos o usuario ya existe' })
    async register(@Body() dtoUsuario: dto.RegisterUserDto) {
        const result = await this.registerUseCase.execute(dtoUsuario);
        if (result.isFailure) {
            throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
        }
        const usuario= result.getValue();

        return{
            data: {
                username: usuario.username,
                email: usuario.email
            },
            message: 'Usuario registrado'
        };
        
    }
}

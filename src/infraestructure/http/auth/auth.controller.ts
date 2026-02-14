import { Body, Controller, Get, HttpException, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user.use-case';
import { RegisterUserDto } from 'src/application/dto/register-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserUseCase } from 'src/application/use-cases/login-user.use-case';
import { LoginDto } from 'src/application/dto/login.dto';
import { jwtAuthGuard } from '../../../shared/guard/jwtAuth.guard';
import { JwtPayload } from 'src/core/services/auth/jwtPayload';
import { CurrentUser } from 'src/shared/decorator/current-user.decorator';
import { Response } from 'express';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
            private registerUseCase: RegisterUserUseCase,
            private loginUseCase: LoginUserUseCase
    ) {}
    
    @Post('register')
    @ApiOperation({ summary: 'Registrar un usuario' })
    @ApiBody({ type: RegisterUserDto })
    @ApiResponse({ status: 201, description: 'Usuario registrado correctamente' })
    @ApiResponse({ status: 400, description: 'Datos inválidos o usuario ya existe' })
    async register(@Body() dtoUsuario: RegisterUserDto) {
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

    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiResponse({
    status: 200,
    description: 'Devuelve accessToken JWT',
    schema: {
        example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
    },
    })
    @Post('login')
    @ApiOperation({ summary: 'Iniciar sesión de un usuario' })
    @ApiBody({ type: LoginDto })
    async login(@Body() dtoLogin: LoginDto, @Res({ passthrough:true}) res: Response) {
        const result = await this.loginUseCase.execute(dtoLogin);
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        return {
            message: 'Inicio de sesión exitoso'
        };
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken'); 
    return { message: 'Sesión cerrada correctamente' };
    }

    @UseGuards(jwtAuthGuard)
    @Get('profile')
    profile(@CurrentUser() user: JwtPayload) {
    return user;
    }
}
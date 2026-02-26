import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user.use-case';
import { RegisterUserDto } from 'src/application/dto/register-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserUseCase } from 'src/application/use-cases/login-user.use-case';
import { LoginDto } from 'src/application/dto/login.dto';
import { jwtAuthGuard } from '../../../shared/guard/jwtAuth.guard';
import { JwtPayload } from 'src/core/services/auth/jwtPayload';
import { CurrentUser } from 'src/shared/decorator/current-user.decorator';
import { Response } from 'express';
import { envs } from 'src/config/envs';
import { AuthGuard } from '@nestjs/passport';
import { GoogleLoginDto } from 'src/application/dto/google-login.dto';
import { GoogleUseCase } from 'src/application/use-cases/google-use.case';
import { LocalAuthGuard } from 'src/shared/guard/localAuth.guard';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
            private registerUseCase: RegisterUserUseCase,
            private loginUseCase: LoginUserUseCase,
            private googleUseCase: GoogleUseCase
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
    @UseGuards(LocalAuthGuard)
    async login(@Body() dto:LoginDto, @Req() req, @Res({ passthrough: true }) res: Response) {
    const result = await this.loginUseCase.execute(req.user);
    res.cookie('accessToken', result.accessToken, { 
        httpOnly: true, 
        sameSite: 'strict', 
        secure: process.env.NODE_ENV === 'production' });
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

    @Get('google')
    @UseGuards(AuthGuard('google'))
    googleLogin(){
        return;
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleCallback(
    @Req() req: Request & { user: GoogleLoginDto },
    @Res() res: Response,
    ) {
    try {
        const result = await this.googleUseCase.execute(req.user);
        if (result.isFailure) {
            throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
        }
        const token = result.getValue();
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        return res.redirect(envs.frontendUrl);
    }catch {
        throw new HttpException('Error al iniciar sesión con Google', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    }
}
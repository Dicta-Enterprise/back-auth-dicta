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
import { ForgotPasswordDto } from 'src/application/dto/forgot-password.dto';
import { ForgotPasswordUseCase } from 'src/application/use-cases/forgot-password.use-case';
import { VerifyResetCodeUseCase } from 'src/application/use-cases/verify-reset-code.use-case';
import { ResetPasswordUseCase } from 'src/application/use-cases/reset-password.use-case';
import { VerifyResetCodeDto } from 'src/application/dto/verify-reset-code.dto';
import { ResetPasswordDto } from 'src/application/dto/reset-password.dto';
import { VerifyEmailUseCase } from 'src/application/use-cases/verify-email.use-case';
import { VerifyEmailDto } from 'src/application/dto/verify-email.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
            private registerUseCase: RegisterUserUseCase,
            private loginUseCase: LoginUserUseCase,
            private googleUseCase: GoogleUseCase,
            private forgotPasswordUseCase: ForgotPasswordUseCase,       
            private verifyResetCodeUseCase: VerifyResetCodeUseCase,    
            private resetPasswordUseCase: ResetPasswordUseCase,
            private verifyEmailUseCase: VerifyEmailUseCase,
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
    @ApiBody({ type: LoginDto })
    @UseGuards(LocalAuthGuard)
    async login(@Body() dto:LoginDto, @Req() req, @Res({ passthrough: true }) res: Response) {
    const result = await this.loginUseCase.execute(req.user);
    res.cookie('accessToken', result.accessToken, { 
        httpOnly: true, 
        sameSite: 'none', 
        secure: true });
    return { 
        message: 'Inicio de sesión exitoso'
     };
    }
    @ApiOperation({ summary: 'Cerrar sesión' })
    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
    }); 
    return { message: 'Sesión cerrada correctamente' };
    }

    @UseGuards(jwtAuthGuard)
    @ApiOperation({ summary: 'Obtener perfil de usuario (prueba)' })
    @Get('profile')
    profile(@CurrentUser() user: JwtPayload) {
    return user;
    }

    @Get('google')
    @ApiOperation({ 
    summary: 'Iniciar flujo de autenticación con Google', 
    description: 'Redirige al usuario a la página de inicio de sesión de Google.' 
    })
    @UseGuards(AuthGuard('google'))
    googleLogin(){
        return;
    }

    @ApiOperation({ 
    summary: 'Callback de autenticación de Google', 
    description: 'Recibe los datos de Google, genera el JWT y redirige al frontend con la cookie de sesión.' 
    })
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
            secure: true,
            sameSite: 'none'
        });
        return res.redirect(envs.frontendUrl);
    }catch {
        throw new HttpException('Error al iniciar sesión con Google', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    }

    @Post('forgot-password')
@ApiOperation({ summary: 'Solicitar código de restablecimiento de contraseña' })
@ApiBody({ type: ForgotPasswordDto })
@ApiResponse({ status: 200, description: 'Código enviado si el correo existe' })
async forgotPassword(@Body() dto: ForgotPasswordDto) {
  const result = await this.forgotPasswordUseCase.execute(dto);
  if (result.isFailure) {
    throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
  }
  // Siempre mismo mensaje para no revelar si el email existe
  return { message: 'Si el correo está registrado, recibirás un código' };
}

@Post('verify-reset-code')
@ApiOperation({ summary: 'Verificar código de restablecimiento' })
@ApiBody({ type: VerifyResetCodeDto })
@ApiResponse({ status: 200, description: 'Código válido' })
async verifyResetCode(@Body() dto: VerifyResetCodeDto) {
  const result = await this.verifyResetCodeUseCase.execute(dto);
  if (result.isFailure) {
    throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
  }
  return { message: 'Código válido' };
}

@Post('reset-password')
@ApiOperation({ summary: 'Restablecer contraseña con código' })
@ApiBody({ type: ResetPasswordDto })
@ApiResponse({ status: 200, description: 'Contraseña actualizada correctamente' })
async resetPassword(@Body() dto: ResetPasswordDto) {
  const result = await this.resetPasswordUseCase.execute(dto);
  if (result.isFailure) {
    throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
  }
  return { message: 'Contraseña actualizada correctamente' };
}

@Post('verify-email')
@ApiOperation({ summary: 'Verificar correo electrónico con código' })
@ApiBody({ type: VerifyEmailDto })
@ApiResponse({ status: 200, description: 'Correo verificado correctamente' })
async verifyEmail(@Body() dto: VerifyEmailDto) {
  const result = await this.verifyEmailUseCase.execute(dto);
  if (result.isFailure) {
    throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
  }
  return { message: 'Correo verificado correctamente. Ya puedes iniciar sesión.' };
}
}
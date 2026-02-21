import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/core/services/auth/auth.service';
import { UsuariosService } from 'src/core/services/usuarios/usuarios.service';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUserUseCase {
constructor(
    private readonly authService: AuthService,
    private readonly usuariosService: UsuariosService
) {}
async execute(dto: LoginDto) {
    const usuario = await this.usuariosService.findByEmail(dto.email);
    if (!usuario) {
        throw new UnauthorizedException('Credenciales inválidas');
    }
    if (usuario.authProvider === 'GOOGLE') {
    throw new UnauthorizedException('Credenciales inválidas');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, usuario.password);
    if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas');
    }
    return {
        accessToken: this.authService.generateAccessToken(
        { id: usuario.id, email: usuario.email })
    }
}
}
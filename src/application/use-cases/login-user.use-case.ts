import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/core/services/auth/auth.service';
import { UsuariosService } from 'src/core/services/usuarios/usuarios.service';

@Injectable()
export class LoginUserUseCase {
constructor(
    private readonly authService: AuthService,
    private readonly usuariosService: UsuariosService
) {}
async execute(user:{id:string, email:string, idrol: number}) {
    return {
        accessToken: this.authService.generateAccessToken(user)
    }
}
}
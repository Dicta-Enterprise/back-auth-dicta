import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly usuariosService: UsuariosService) {
    super({ usernameField: 'email' }); 
  }

  async validate(email: string, password: string) {
  const usuario = await this.usuariosService.validateLocalUser(email, password);
  return { id: usuario.id, email: usuario.email, idrol: usuario.idrol };
}
}
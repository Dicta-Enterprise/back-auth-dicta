import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../dto/register-user.dto';
import { Usuario } from 'src/core/entities/usuario.enity';
import { Result } from 'src/shared/domain/result/result';
import { UsuariosService } from 'src/core/services/usuarios/usuarios.service';

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly usuarioService: UsuariosService) {}

  async execute(dto: RegisterUserDto): Promise <Result<Usuario>> {
    try {
      const usuario = await this.usuarioService.crearUsuario(dto);
      return Result.ok<Usuario>(usuario);
      
    }catch (error) {
      return Result.fail(error);
    }
  }
}


import { Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/core/services/usuarios/usuarios.service';

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly usuariosService: UsuariosService) {}

  async execute(id: number) {
    return await this.usuariosService.findById(id);
  }
}
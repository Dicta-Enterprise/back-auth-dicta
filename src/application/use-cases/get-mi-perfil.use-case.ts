import { Injectable, NotFoundException } from '@nestjs/common';
import { UsuariosService } from 'src/core/services/usuarios/usuarios.service';
import { UbicacionUsuarioService } from 'src/core/services/ubicacion-usuario/ubicacion-usuario.service';
import { Result } from 'src/shared/domain/result/result';

export interface MiPerfilResult {
  id: number;
  username: string;
  email: string;
  ubicacion: {
    pais: { id: number; nombre: string } | null;
    ciudad: string | null;
    zonaHoraria: string | null;
  } | null;
}

@Injectable()
export class GetMiPerfilUseCase {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly ubicacionUsuarioService: UbicacionUsuarioService,
  ) {}

  async execute(idusuario: number): Promise<Result<MiPerfilResult>> {
    try {
      const usuario = await this.usuariosService.findById(idusuario);
      if (!usuario) {
        return Result.fail(new NotFoundException('Usuario no encontrado'));
      }

      const ubicacion = await this.ubicacionUsuarioService.obtenerUbicacionOpcional(idusuario);

      return Result.ok<MiPerfilResult>({
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
        ubicacion: ubicacion
          ? {
              pais: ubicacion.pais ?? null,
              ciudad: ubicacion.ciudad,
              zonaHoraria: ubicacion.zonaHoraria,
            }
          : null,
      });
    } catch (error) {
      return Result.fail(error);
    }
  }
}

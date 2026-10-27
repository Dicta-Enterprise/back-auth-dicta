import { Inject, Injectable } from '@nestjs/common';
import { USUARIO_ADMIN_REPOSITORY } from 'src/core/constants/constants';
import { UsuarioAdminRepository } from 'src/core/repositories/usuario-admin.repository';
import { FiltrosUsuariosAdmin } from 'src/core/entities/usuario-admin/usuario-admin.entity';
import { construirListaUsuarios } from 'src/core/services/usuarios-admin/lista-usuarios.builder';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class ListarUsuariosInternoUseCase {
  constructor(
    @Inject(USUARIO_ADMIN_REPOSITORY)
    private readonly repository: UsuarioAdminRepository,
  ) {}

  async execute(filtros: FiltrosUsuariosAdmin) {
    try {
      const [usuarios, familias] = await Promise.all([
        this.repository.findUsuariosLms(),
        this.repository.findFamilias(),
      ]);
      return Result.ok(construirListaUsuarios(usuarios, familias, filtros));
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al listar los usuarios.'));
    }
  }
}

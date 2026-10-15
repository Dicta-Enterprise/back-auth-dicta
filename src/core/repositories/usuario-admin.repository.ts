import { FilaFamiliaBase, FilaUsuarioBase } from '../entities/usuario-admin/usuario-admin.entity';

export interface UsuarioAdminRepository {
  // Usuarios de la LMS: padres (roles cliente o pendiente) y cuentas de hijos.
  findUsuariosLms(): Promise<FilaUsuarioBase[]>;
  findFamilias(): Promise<FilaFamiliaBase[]>;
}

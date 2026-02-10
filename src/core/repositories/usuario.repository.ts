import { Usuario } from '../entities/auth/usuario.enity';


export interface UsuarioRepository {
    findByEmail(email: string): Promise<Usuario | null>;
    create(usuario: Usuario): Promise<Usuario>;
}
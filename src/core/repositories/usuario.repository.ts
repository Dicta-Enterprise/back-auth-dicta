import { Usuario } from '../entities/usuario.enity';


export interface UsuarioRepository {
    findByEmail(email: string): Promise<Usuario | null>;
    findByUsername(username: string): Promise<Usuario | null>;
    create(usuario: Usuario): Promise<Usuario>;
}
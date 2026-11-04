import { Usuario } from '../entities/auth/usuario.enity';


// Lo que se necesita de un usuario para mostrarlo o saludarlo. "username" se mantiene por compatibilidad.
export interface UsuarioBasico {
  id: number;
  username: string;
  nombre: string | null;
  apellido: string | null;
  email: string;
}

export interface UsuarioRepository {
    findByEmail(email: string): Promise<Usuario | null>;
    findById(id: number): Promise<UsuarioBasico | null>;
    create(usuario: Usuario): Promise<Usuario>;
    findByGoogleId(googleId: string): Promise<Usuario | null>;
    saveResetCode(id: number, code: string, expires: Date): Promise<void>;
    updatePassword(id: number, hashedPassword: string): Promise<void>; 
    incrementResetAttempts(id: number): Promise<void>;
    saveVerifyCode(id: number, code: string, expires: Date): Promise<void>;   
    activarUsuario(id: number): Promise<void>;                                
    incrementVerifyAttempts(id: number): Promise<void>;                        
    eliminarUsuario(id: number): Promise<void>;
}
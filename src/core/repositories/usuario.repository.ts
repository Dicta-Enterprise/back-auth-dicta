import { Usuario } from '../entities/auth/usuario.enity';


export interface UsuarioRepository {
    findByEmail(email: string): Promise<Usuario | null>;
    findById(id: number): Promise<{ id: number; username: string; email: string } | null>;
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
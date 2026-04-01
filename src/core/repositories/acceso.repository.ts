import { Acceso } from '../entities/acceso/acceso.entity';

export interface AccesoRepository {
     create(acceso: Acceso): Promise<Acceso>;
     findAccesoById(id: number): Promise<Acceso | null>;
     findAccesoByCodigo(codigo: string): Promise<Acceso | null>;
}
import { TipoUsuario } from '../../services/identificadores/identificadores';

export type RolLms = 'PADRE' | 'NINO' | 'JOVEN';

// BLOQUEADA está reservado para el interruptor de familia; todavía no se produce.
export type EstadoUsuarioAdmin = 'ACTIVA' | 'PENDIENTE' | 'INACTIVA' | 'BLOQUEADA';

export interface UsuarioAdmin {
  id: number;
  codigo: string;
  tipo: TipoUsuario;
  rol: RolLms;
  nombre: string;
  email: string;
  estado: EstadoUsuarioAdmin;
  familia: { id: number; codigo: string; nombre: string | null } | null;
  fechaRegistro: Date | null;
}

export interface ListaUsuariosAdmin {
  items: UsuarioAdmin[];
  total: number;
  page: number;
  limit: number;
}

// Filas tal como salen de la base, antes de calcular tipo, estado y códigos.
export interface FilaUsuarioBase {
  id: number;
  username: string;
  email: string;
  idrol: number | null;
  estado: number | null;
  fechadecreacion: Date | null;
  cuentaComoHijo: {
    tipocuenta: string;
    alias: string | null;
    estado: string;
    idpadre: number;
  } | null;
}

export interface FilaFamiliaBase {
  id: number;
  idpadre: number;
  nombre: string | null;
}

export interface FiltrosUsuariosAdmin {
  q?: string;
  id?: string;
  rol?: RolLms;
  estado?: EstadoUsuarioAdmin;
  familia?: string;
  desde?: Date;
  hasta?: Date;
  page?: number;
  limit?: number;
}

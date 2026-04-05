import { Inject, Injectable } from '@nestjs/common';
import { CreateRolDto } from 'src/application/dto/create-rol.dto';
import { ROL_REPOSITORY } from 'src/core/constants/constants';
import { Rol } from 'src/core/entities/rol/rol.entity';
import { RolRepository } from 'src/core/repositories/rol.repository';

@Injectable()
export class RolService {
  constructor(@Inject(ROL_REPOSITORY) private rolRepository: RolRepository) {}

  async crearRol(dto: CreateRolDto): Promise<Rol> {
    const existentePorId = await this.rolRepository.existsById(dto.id);
    if (existentePorId) {
      throw new Error(`Ya existe un rol con el ID ${dto.id}`);
    }

    const existentePorNombre = await this.rolRepository.findByNombre(dto.nombreRol);
    if (existentePorNombre) {
      throw new Error(`Ya existe un rol con el nombre ${dto.nombreRol}`);
    }

    const rol = new Rol(
      dto.id,
      dto.nombreRol,
      dto.estado ?? 1,
      dto.descripcion,
      dto.tipo,
    );

    return await this.rolRepository.create(rol);
  }

  async obtenerTodosLosRoles(): Promise<Rol[]> {
    return await this.rolRepository.findAll();
  }

  async obtenerRolPorId(id: number): Promise<Rol | null> {
    return await this.rolRepository.findById(id);
  }

  async registrarRolesBase(): Promise<{ 
    creados: Rol[], 
    existentes: Rol[], 
    todos: Rol[],
    mensaje: string 
  }> {
    const rolesBase = [
      { id: 1, nombreRol: 'Administrador', descripcion: 'Rol con acceso total al sistema', tipo: 'admin', estado: 1 },
      { id: 2, nombreRol: 'Trabajador', descripcion: 'Rol para empleados del sistema', tipo: 'employee', estado: 1 },
      { id: 3, nombreRol: 'Cliente', descripcion: 'Rol para clientes del sistema', tipo: 'customer', estado: 1 },
    ];

    const rolesCreados: Rol[] = [];
    const rolesExistentes: Rol[] = [];

    for (const rolData of rolesBase) {
      try {
        // Verificar si el rol existe en la base de datos
        const existe = await this.rolRepository.existsById(rolData.id);
        
        if (!existe) {
          // Si no existe, lo creamos
          const rol = new Rol(
            rolData.id,
            rolData.nombreRol,
            rolData.estado,
            rolData.descripcion,
            rolData.tipo,
          );
          const rolCreado = await this.rolRepository.create(rol);
          rolesCreados.push(rolCreado);
        } else {
          // Si ya existe, lo obtenemos de la base de datos
          const rolExistente = await this.rolRepository.findById(rolData.id);
          if (rolExistente) {
            rolesExistentes.push(rolExistente);
          }
        }
      } catch (error) {
        console.error(`Error al procesar rol ${rolData.nombreRol}:`, error.message);
        throw error;
      }
    }

    // Determinar el mensaje según el resultado
    let mensaje = '';
    if (rolesCreados.length === 0 && rolesExistentes.length === 3) {
      mensaje = 'Los roles base ya estaban registrados anteriormente. No se insertaron nuevos roles.';
    } else if (rolesCreados.length > 0 && rolesExistentes.length > 0) {
      mensaje = `Roles registrados parcialmente. Se crearon ${rolesCreados.length} rol(es) y ${rolesExistentes.length} ya existían.`;
    } else if (rolesCreados.length === 3) {
      mensaje = 'Roles base registrados con éxito por primera vez.';
    } else {
      mensaje = `Proceso completado. ${rolesCreados.length} rol(es) creado(s), ${rolesExistentes.length} ya existían.`;
    }

    return {
      creados: rolesCreados,
      existentes: rolesExistentes,
      todos: [...rolesCreados, ...rolesExistentes],
      mensaje
    };
  }
}
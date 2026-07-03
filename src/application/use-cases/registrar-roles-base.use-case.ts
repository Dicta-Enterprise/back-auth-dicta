import { Injectable } from '@nestjs/common';
import { RolService } from 'src/core/services/rol/rol.service';
import { Result } from 'src/shared/domain/result/result';
import { Rol } from 'src/core/entities/rol/rol.entity';

@Injectable()
export class RegistrarRolesBaseUseCase {
  constructor(private rolService: RolService) {}

  async execute(): Promise<Result<{ 
    creados: Rol[], 
    existentes: Rol[], 
    todos: Rol[],
    mensaje: string 
  }>> {
    try {
      const resultado = await this.rolService.registrarRolesBase();
      return Result.ok(resultado);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al registrar roles base.'));
    }  
  }
}
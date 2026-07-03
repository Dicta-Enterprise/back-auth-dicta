import { Injectable } from '@nestjs/common';
import { RolService } from 'src/core/services/rol/rol.service';
import { Result } from 'src/shared/domain/result/result';
import { CreateRolDto } from '../dto/create-rol.dto';
import { Rol } from 'src/core/entities/rol/rol.entity';

@Injectable()
export class CreateRolUseCase {
  constructor(private rolService: RolService) {}

  async execute(dto: CreateRolDto): Promise<Result<Rol>> {
    try {
      const rol = await this.rolService.crearRol(dto);
      return Result.ok(rol);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al crear el rol.'));
    }
  }
}
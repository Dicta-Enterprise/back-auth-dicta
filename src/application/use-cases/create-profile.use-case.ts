import { Injectable } from '@nestjs/common';
import { PerfilService } from 'src/core/services/perfil/perfil.service';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { Result } from 'src/shared/domain/result/result';
import { Perfil } from 'src/core/entities/perfil/perfil.entity';

@Injectable()
export class CreateProfileUseCase {
    constructor(
        private readonly perfilService: PerfilService,
    ) {}
    async execute(userId: number, dto: CreateProfileDto): Promise<Result<Perfil>> {
    try {
        const perfil = await this.perfilService.crearPerfil(userId, dto);
        return Result.ok(perfil);
    }catch (error){
          return Result.fail(error);
    }
}
}

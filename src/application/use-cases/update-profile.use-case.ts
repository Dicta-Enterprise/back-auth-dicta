import { Injectable } from '@nestjs/common';
import { Perfil } from 'src/core/entities/perfil/perfil.entity';
import { Result } from 'src/shared/domain/result/result';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { PerfilService } from 'src/core/services/perfil/perfil.service';

@Injectable()
export class UpdateProfileUseCase {
    constructor(private readonly perfilService: PerfilService) {}
    async execute(perfilId: number, userId: number, data: UpdateProfileDto): Promise<Result<Perfil>> {
        try {
            const perfilActualizado = await this.perfilService.updatePerfil(perfilId, userId, data);
            return Result.ok(perfilActualizado);
        } catch (error) {
            return Result.fail(error);
        }
    }
}
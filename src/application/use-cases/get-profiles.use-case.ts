import { Injectable } from '@nestjs/common';
import { PerfilService } from 'src/core/services/perfil/perfil.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class GetProfilesUseCase {
    constructor(
        private readonly perfilService: PerfilService,
    ) {}
    async execute(userId: number) {
       try {
            const perfiles = await this.perfilService.verPerfil(userId);
            return Result.ok(perfiles); 
        } catch {
            return Result.fail(new Error('Ocurrió un error desconocido al obtener los perfiles.'));
        }
    }
}
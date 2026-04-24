import { HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from 'src/application/dto/create-profile.dto';
import { PerfilRepository } from 'src/core/repositories/perfil.repository';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
import * as bcrypt from 'bcrypt';
import { Perfil } from 'src/core/entities/perfil/perfil.entity';
import { PERFIL_REPOSITORY } from 'src/core/constants/constants';
import { UpdateProfileDto } from 'src/application/dto/update-profile.dto';

@Injectable()
export class PerfilService {
    constructor(
    @Inject(PERFIL_REPOSITORY) 
    private readonly repository: PerfilRepository,
    private readonly validator: ValidatorService
    ) {}
    async crearPerfil(userId: number, dto: CreateProfileDto){
        await this.validator.validate(dto, CreateProfileDto);

        if (dto.confirmPassword !== dto.password) {
        throw new BussinesRuleException(
            'Las contraseñas no coinciden',
            HttpStatus.BAD_REQUEST,
            { codigoError: 'PASSWORDS_NOT_MATCH' },
        );
        }

        const perfilesActuales = await this.repository.findAllByUserId(userId);
        if(perfilesActuales.length >=4){
            throw new BussinesRuleException('Limite de perfiles alcanzado', HttpStatus.BAD_REQUEST);
        }

        const idRol=3;
        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(dto.password, salt);

        const perfil = new Perfil(
            null,
            dto.nombre,
            hashedPassword,
            userId,
            idRol,
            1,
            dto.imageurl
        );
        
        return this.repository.create(perfil)   ;
}
async verPerfil(userId: number): Promise<Perfil[]> {
    const perfiles = await this.repository.findAllByUserId(userId);
    if (perfiles.length === 0) {
        throw new NotFoundException('No se encontraron perfiles para este usuario');
    }
    return perfiles;
}
async updatePerfil(perfilId: number, userId: number, data: UpdateProfileDto) {
    const existe= await this.repository.findProfileById(perfilId, userId);
    if(!existe){
        throw new NotFoundException('Perfil no existe');
    }

    if ((data as any).password) {
        const salt = await bcrypt.genSalt(10);
        (data as any).password = await bcrypt.hash((data as any).password, salt);
    }
    
    return this.repository.update(perfilId, userId, data);
}
}

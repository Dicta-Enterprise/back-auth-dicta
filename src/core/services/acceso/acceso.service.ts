import { Inject, Injectable } from '@nestjs/common';
import { CreateAccesoDto } from 'src/application/dto/create-acceso.dto';
import { ACCESO_REPOSITORY } from 'src/core/constants/constants';
import { Acceso } from 'src/core/entities/acceso/acceso.entity';
import { AccesoRepository } from 'src/core/repositories/acceso.repository';
@Injectable()
export class AccesoService {
    constructor(@Inject(ACCESO_REPOSITORY) private accesoRepository: AccesoRepository) {}
    async crearAcceso(dto: CreateAccesoDto) {
        const existente = await this.accesoRepository.findAccesoByCodigo(dto.codigo);
        if (existente) {
            throw new Error('Codigo de acceso ya existe');
        }
        const acceso = new Acceso(
            null,
            dto.codigo,
            1,
            dto.descripcion
        );
        return await this.accesoRepository.create(acceso);
    }
}
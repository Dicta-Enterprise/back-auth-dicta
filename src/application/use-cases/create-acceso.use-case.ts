import {  Injectable } from '@nestjs/common';
import { AccesoService } from 'src/core/services/acceso/acceso.service';
import { Result } from 'src/shared/domain/result/result';
import { CreateAccesoDto } from '../dto/create-acceso.dto';
import { Acceso } from 'src/core/entities/acceso/acceso.entity';

@Injectable()
export class CreateAccesoUseCase {
    constructor(private accesoService: AccesoService) {}
    async execute(dto: CreateAccesoDto): Promise<Result<Acceso>> {
        try {
            const acceso = await this.accesoService.crearAcceso(dto);
            return Result.ok(acceso);
        } catch (error) {
            return Result.fail(error);
        }
    }
}
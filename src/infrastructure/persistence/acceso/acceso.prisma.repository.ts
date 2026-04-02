import { Injectable } from '@nestjs/common';
import { Acceso } from 'src/core/entities/acceso/acceso.entity';
import { AccesoRepository } from 'src/core/repositories/acceso.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class AccesoPrismaRepository implements AccesoRepository {
    constructor(private prisma:PrismaService ) {}
    async findAccesoByCodigo(codigo: string): Promise<Acceso | null> {
        const data=await this.prisma.accesos.findUnique({
            where: {
                codigo: codigo
            }
        });
        return data ? Acceso.fromPrisma(data) : null;
    }
    async create(acceso: Acceso): Promise<Acceso> {
        const data= await this.prisma.accesos.create({
            data: {
            codigo: acceso.codigo,
            descripcion: acceso.descripcion,
            estado: acceso.estado ?? 1,
            },
        });
        return Acceso.fromPrisma(data);
    }
    async findAccesoById(id: number): Promise<Acceso | null> {
        const data=await this.prisma.accesos.findUnique({
            where: {
                id: id
            }
        });
        return data ? Acceso.fromPrisma(data) : null;
    }

}
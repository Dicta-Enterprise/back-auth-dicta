import { Injectable } from '@nestjs/common';
import { Perfil } from 'src/core/entities/perfil/perfil.entity';
import { PerfilRepository } from 'src/core/repositories/perfil.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class PerfilPrismaRepository implements PerfilRepository {
  constructor(private prisma: PrismaService) {}
     async create(perfil: Perfil): Promise<Perfil> {
        const data= await this.prisma.perfil.create({
            data: {
                nombre: perfil.nombre,
                password: perfil.password,
                imageurl: perfil.imageurl,
                idusuario: perfil.idusuario,
                idrol: perfil.idrol,
                estado: 1,
            }
        });
    return Perfil.fromPrisma(data);
    }

     async findAllByUserId(userId: number): Promise<Perfil[]> {
        const data= await this.prisma.perfil.findMany({where: {idusuario:userId}})
        return data.map((p) => Perfil.fromPrisma(p));
    }
  
}

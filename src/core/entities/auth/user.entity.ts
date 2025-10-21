import { usuarios } from '../../../../generated/prisma';

export class UserEntity {
    constructor(
        public readonly id: number,
        public readonly username: string,
        public readonly email: string,
        public readonly password: string,
        public readonly estado: number,
        public readonly fechadecreacion: Date,
        public readonly idrol?: number | null,
    ){}

    /**
     * Método de fabrica para crear instancia desde datos de Prisma
     */

    static fromPrisma(prismaUser: usuarios): UserEntity{
        return new UserEntity(
            prismaUser.id,
            prismaUser.username,
            prismaUser.email,
            prismaUser.password,
            prismaUser.estado,
            prismaUser.fechadecreacion,
            prismaUser.idrol,
        );
    }

    /**
     * Convertimos a DTO de respuesta sin exponer password
     */
    toResponse(){
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            estado: this.estado,
            fechadecreacion: this.fechadecreacion,
        };
    }
}
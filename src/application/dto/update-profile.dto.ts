import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, IsEmail } from 'class-validator';

export class UpdateProfileDto {
    @ApiProperty({ example: 'Jose', description: 'Nombre del perfil', required: false })
    @IsString({message: 'El nombre del perfil debe ser un texto valido'})
    @IsOptional()
    nombre?: string;
    
    @ApiProperty({ example: 'https://nueva-imagen.com/foto.png', required: false })
    @IsOptional()
    @IsUrl({}, { message: 'La URL de la imagen no es válida' })
    imageurl?: string;

    @ApiProperty({ example: 'jose@gmail.com', required: false })
    @IsEmail({}, { message: 'El email no es válido' })
    @IsOptional()
    email?: string;

    @ApiProperty({ example: 'NuevaPassword123!', required: false })
    @IsString({ message: 'La contraseña debe ser un texto válido' })
    @IsOptional()
    password?: string;
}
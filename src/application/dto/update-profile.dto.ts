import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
    @ApiProperty({ example: 'Jose', description: 'Nombre del perfil', required: false })
    @IsString({message: 'El nombre del perfil debe ser un texto valido'})
    @IsOptional()
    nombre?: string;
    
    @ApiProperty({ example: 'https://nueva-imagen.com/foto.png', required: false })
    @IsOptional()
    @IsUrl({}, { message: 'La URL de la imagen no es válida' })
    imageurl?: string;
}
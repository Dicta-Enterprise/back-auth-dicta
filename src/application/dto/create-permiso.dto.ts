import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePermisoDto {
  @ApiProperty({ example: 'READ', description: 'Código único del permiso' })
  @IsString()
  @IsNotEmpty({ message: 'El código del permiso es obligatorio' })
  @MinLength(2, { message: 'El código debe tener al menos 2 caracteres' })
  codigo: string;

  @ApiProperty({ example: 'Leer datos', description: 'Nombre del permiso' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del permiso es obligatorio' })
  nombre: string;

  @ApiProperty({ example: 'Permiso para leer información del sistema', description: 'Descripción del permiso', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateRolDto {
  @ApiProperty({ 
    example: 1, 
    description: 'ID único del rol' 
  })
  @IsNumber()
  @IsNotEmpty({ message: 'El ID del rol es obligatorio' })
  id: number;

  @ApiProperty({ 
    example: 'Administrador', 
    description: 'Nombre del rol' 
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del rol es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombreRol: string;

  @ApiProperty({ 
    example: 'Rol con acceso total al sistema', 
    description: 'Descripción del rol',
    required: false
  })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ 
    example: 'admin', 
    description: 'Tipo de rol',
    required: false
  })
  @IsString()
  @IsOptional()
  tipo?: string;

  @ApiProperty({ 
    example: 1, 
    description: 'Estado del rol (1: activo, 0: inactivo)',
    required: false
  })
  @IsNumber()
  @IsOptional()
  estado?: number;
}
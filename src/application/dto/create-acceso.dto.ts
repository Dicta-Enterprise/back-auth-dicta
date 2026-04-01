import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAccesoDto {
  @ApiProperty({ 
    example: 'WRITE', 
    description: 'Código único para identificar el permiso (ej. READ, WRITE, DELETE)' 
  })
  @IsString()
  @IsNotEmpty({ message: 'El código de acceso es obligatorio' })
  @MinLength(3, { message: 'El código debe tener al menos 3 caracteres' })
  codigo: string;

  @ApiProperty({ 
    example: 'Permite crear nuevos registros en el sistema', 
    description: 'Descripción detallada de qué permite hacer este acceso',
  })
  @IsString()
  @IsNotEmpty({ message: 'La descripción del acceso es obligatoria' })
  descripcion: string;
}
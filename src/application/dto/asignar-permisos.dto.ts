import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, ArrayMinSize } from 'class-validator';

export class AsignarPermisosDto {
  @ApiProperty({ example: 1, description: 'ID del rol' })
  @IsNumber()
  @IsNotEmpty({ message: 'El ID del rol es obligatorio' })
  idRol: number;

  @ApiProperty({ example: [1, 2, 3], description: 'IDs de los permisos a asignar' })
  @IsArray()
  @ArrayMinSize(1, { message: 'Debe asignar al menos un permiso' })
  @IsNumber({}, { each: true })
  permisosIds: number[];
}
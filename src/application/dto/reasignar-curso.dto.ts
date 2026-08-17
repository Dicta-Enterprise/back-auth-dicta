import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class ReasignarCursoDto {
  @ApiProperty({
    example: 8,
    description: 'ID de la nueva cuenta asociada a la que se reasignará el curso',
  })
  @IsInt({ message: 'El id de la cuenta asociada debe ser un número entero' })
  @IsNotEmpty({ message: 'La cuenta asociada es obligatoria' })
  idcuentaasociada: number;
}


import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TipoCuentaFamiliar } from 'generated/prisma';

export class CreateCursoAsignadoDto {
  @ApiProperty({
    example: 5,
    description: 'ID de la cuenta asociada a la que se asignará el curso',
  })
  @IsInt({ message: 'El id de la cuenta asociada debe ser un número entero' })
  @IsNotEmpty({ message: 'La cuenta asociada es obligatoria' })
  idcuentaasociada: number;

  @ApiProperty({
    example: '64f1a2b3c4d5e6f7a8b9c0d1',
    description: 'ID del curso (referencia externa, 24 caracteres)',
  })
  @IsString({ message: 'El id del curso debe ser un texto válido' })
  @IsNotEmpty({ message: 'El curso es obligatorio' })
  @MaxLength(24, { message: 'El id del curso no puede exceder los 24 caracteres' })
  idcurso: string;

  @ApiProperty({
    example: 'NINO',
    description: 'Tipo de curso a asignar (dirigido a NINO o JOVEN), informado por el cliente',
    enum: TipoCuentaFamiliar,
  })
  @IsEnum(TipoCuentaFamiliar, { message: 'El tipo de curso debe ser NINO o JOVEN' })
  @IsNotEmpty({ message: 'El tipo de curso es obligatorio' })
  tipoCurso: TipoCuentaFamiliar;
}


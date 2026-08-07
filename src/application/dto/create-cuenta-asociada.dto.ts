import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { TipoCuentaFamiliar } from 'generated/prisma';

export class CreateCuentaAsociadaDto {
  @ApiProperty({
    example: 'sofia@correo.com',
    description: 'Correo de la persona a invitar como cuenta asociada',
  })
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  correo: string;

  @ApiProperty({
    example: 'Mi hijo mayor',
    description: 'Alias de la cuenta familiar asociada',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'El alias debe ser un texto válido' })
  @IsNotEmpty({ message: 'El alias es obligatorio' })
  @MinLength(2, { message: 'El alias debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El alias no puede exceder los 50 caracteres' })
  alias: string;

  @ApiProperty({
    example: '2015-03-20',
    description: 'Fecha de nacimiento de la cuenta asociada',
  })
  @IsDateString({}, { message: 'La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  fechaNacimiento: string;

  @ApiProperty({
    example: 'NINO',
    description: 'Tipo de cuenta asociada',
    enum: TipoCuentaFamiliar,
  })
  @IsEnum(TipoCuentaFamiliar, { message: 'El tipo de cuenta debe ser NINO o JOVEN' })
  @IsNotEmpty({ message: 'El tipo de cuenta es obligatorio' })
  tipoCuenta: TipoCuentaFamiliar;
}
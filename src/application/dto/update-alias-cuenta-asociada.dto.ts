import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateAliasCuentaAsociadaDto {
  @ApiProperty({
    example: 'Mi hijo mayor',
    description: 'Nuevo alias para la cuenta familiar asociada',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'El alias debe ser un texto válido' })
  @IsNotEmpty({ message: 'El alias es obligatorio' })
  @MinLength(2, { message: 'El alias debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El alias no puede exceder los 50 caracteres' })
  alias: string;
}
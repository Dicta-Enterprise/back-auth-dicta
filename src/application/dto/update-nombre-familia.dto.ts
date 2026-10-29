import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateNombreFamiliaDto {
  @ApiProperty({ example: 'Familia Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;
}

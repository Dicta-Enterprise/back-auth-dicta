import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export const ROLES_LMS_FILTRO = ['PADRE', 'NINO', 'JOVEN'] as const;
export const ESTADOS_USUARIO_FILTRO = ['ACTIVA', 'PENDIENTE', 'INACTIVA', 'BLOQUEADA'] as const;

export class ListarUsuariosInternoDto {
  @ApiPropertyOptional({ example: 'sofia', description: 'Busca en nombre, correo, código y nombre de familia.' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({
    example: 'USR-N-032',
    description: 'ID del usuario o de la familia: UUID, código (USR-P/N/J-000, FAM-000) o número.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  id?: string;

  @ApiPropertyOptional({ enum: ROLES_LMS_FILTRO })
  @IsOptional()
  @IsIn(ROLES_LMS_FILTRO)
  rol?: (typeof ROLES_LMS_FILTRO)[number];

  @ApiPropertyOptional({ enum: ESTADOS_USUARIO_FILTRO })
  @IsOptional()
  @IsIn(ESTADOS_USUARIO_FILTRO)
  estado?: (typeof ESTADOS_USUARIO_FILTRO)[number];

  @ApiPropertyOptional({ example: 'FAM-014', description: 'Código, número o parte del nombre de la familia.' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  familia?: string;

  @ApiPropertyOptional({ example: '2026-10-01', description: 'Registrados desde esta fecha.' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  desde?: Date;

  @ApiPropertyOptional({ example: '2026-10-31', description: 'Registrados hasta esta fecha.' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  hasta?: Date;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20, default: 20, description: 'Máximo 100.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

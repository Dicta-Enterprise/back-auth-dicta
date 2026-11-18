import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export const TIPOS_USUARIO_FAMILIA = ['FREE', 'PREMIUM'] as const;

export class ActualizarTipoUsuarioFamiliaDto {
  @ApiProperty({
    enum: TIPOS_USUARIO_FAMILIA,
    example: 'PREMIUM',
    description: 'PREMIUM si el padre tiene al menos una compra completada; FREE si no.',
  })
  @IsIn(TIPOS_USUARIO_FAMILIA)
  tipoUsuario!: (typeof TIPOS_USUARIO_FAMILIA)[number];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TipoCuentaFamiliar } from 'generated/prisma';

export class ListarCuentasDisponiblesDto {
  @ApiProperty({
    example: 'NINO',
    description: 'Tipo de curso a asignar (dirigido a NINO o JOVEN)',
    enum: TipoCuentaFamiliar,
  })
  @IsEnum(TipoCuentaFamiliar, { message: 'El tipo de curso debe ser NINO o JOVEN' })
  @IsNotEmpty({ message: 'El tipo de curso es obligatorio' })
  tipoCurso: TipoCuentaFamiliar;
}

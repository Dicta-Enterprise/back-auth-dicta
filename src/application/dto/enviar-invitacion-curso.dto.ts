import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsString, Length } from 'class-validator';

export class EnviarInvitacionCursoDto {
  @ApiProperty({
    example: 1,
    description: 'Id de la cuenta asociada existente a la que se enviará la invitación',
  })
  @IsInt({ message: 'El id de la cuenta asociada debe ser un número entero' })
  @IsNotEmpty({ message: 'El id de la cuenta asociada es obligatorio' })
  idCuentaAsociada: number;

  @ApiProperty({
    example: 'sofia@correo.com',
    description: 'Correo del destinatario de la invitación',
  })
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  correo: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'Id del curso (Mongo ObjectId de 24 caracteres) que se asignará al aceptar la invitación',
  })
  @IsString({ message: 'El id del curso debe ser un texto válido' })
  @Length(24, 24, { message: 'El id del curso debe tener 24 caracteres' })
  @IsNotEmpty({ message: 'El id del curso es obligatorio' })
  cursoId: string;
}

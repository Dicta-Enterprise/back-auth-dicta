import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class AceptarInvitacionCursoDto {
  @ApiProperty({ example: 'a1b2c3...', description: 'Token recibido en el correo de invitación' })
  @IsNotEmpty({ message: 'El token es requerido' })
  token: string;

  @ApiProperty({ example: 'Sofia', description: 'Nombre de usuario (3 a 50 caracteres)' })
  @IsNotEmpty({ message: 'El username es requerido' })
  @MinLength(3, { message: 'El username debe tener mínimo 3 caracteres' })
  @MaxLength(50, { message: 'El username debe tener máximo 50 caracteres' })
  username: string;

  @ApiProperty({ example: 'Hola1234!', description: 'Contraseña (mínimo 8 caracteres, al menos un número)' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres' })
  @IsStrongPassword(
    { minLength: 8, minLowercase: 0, minUppercase: 0, minNumbers: 1, minSymbols: 0 },
    { message: 'Contraseña débil: usa al menos un número' },
  )
  password: string;

  @ApiProperty({ example: 'Hola1234!', description: 'Confirmación de contraseña' })
  @IsNotEmpty({ message: 'La confirmación de contraseña es requerida' })
  @MinLength(8, { message: 'La confirmación debe tener mínimo 8 caracteres' })
  confirmPassword: string;

  @ApiProperty({ example: true, description: 'Aceptación de términos y condiciones', default: false })
  @IsBoolean()
  @IsNotEmpty({ message: 'La aceptación de términos es requerida' })
  acceptTerms: boolean = false;
}

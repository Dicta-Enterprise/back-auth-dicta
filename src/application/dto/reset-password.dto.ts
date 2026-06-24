import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'jose@gmail.com' })
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @ApiProperty({ example: '483920' })
  @IsNotEmpty({ message: 'El código es requerido' })
  @IsString()
  @Length(6, 6, { message: 'El código debe tener 6 dígitos' })
  code: string;

  @ApiProperty({ example: 'NuevoPass123!' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres' })
  @IsStrongPassword(
    { minLength: 8, minLowercase: 0, minUppercase: 0, minNumbers: 1, minSymbols: 0 },
    { message: 'Contraseña débil: usa al menos un número' },
  )
  newPassword: string;

  @ApiProperty({ example: 'NuevoPass123!' })
  @IsNotEmpty({ message: 'La confirmación es requerida' })
  confirmPassword: string;
}
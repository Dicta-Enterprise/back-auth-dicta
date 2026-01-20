import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    example: 'Jose',
    description: 'Nombre de usuario (3 a 50 caracteres)',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'El username es requerido' })
  @MinLength(3, { message: 'El username debe tener mínimo 3 caracteres' })
  @MaxLength(50, { message: 'El username debe tener máximo 50 caracteres' })
  username: string;

  @ApiProperty({
    example: 'jose@gmail.com',
    description: 'Correo del usuario',
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @ApiProperty({
    example: '12345678',
    description: 'Contraseña (mínimo 8 caracteres)',
    minLength: 8,
  })
  @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres' })
  password: string;

  @ApiProperty({
    example: '12345678',
    description: 'Confirmación de contraseña (debe coincidir con password)',
    minLength: 8,
  })
  @MinLength(8, { message: 'La confirmación debe tener mínimo 8 caracteres' })
  confirmPassword: string;
}

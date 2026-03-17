import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsStrongPassword, IsUrl, MinLength } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 'Jose', description: 'Nombre del perfil' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del perfil es obligatorio' })
  nombre: string;

  @ApiProperty({ example: 'https://avatar.com/foto1.png', required: false })
  @IsOptional()
  @IsUrl({}, { message: 'La URL de la imagen no es válida' })
  imageurl?: string;

  @ApiProperty({
      example: 'Hola1234!',
      description:
        'Contraseña (mínimo un número)',
      minLength: 8,
    })
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres' })
    @IsStrongPassword(
      { minLength: 8, minLowercase: 0, minUppercase: 0, minNumbers: 1, minSymbols: 0 },
      { message: 'Contraseña débil: usa al menos un número' },
    )
    password: string;

    @ApiProperty({
    example: 'Hola1234!',
    description: 'Confirmación de contraseña (debe coincidir con password)',
    minLength: 8,
    })
    @IsNotEmpty({ message: 'La confirmación de contraseña es requerida' })
    @MinLength(8, { message: 'La confirmación debe tener mínimo 8 caracteres' })
    confirmPassword: string;
}
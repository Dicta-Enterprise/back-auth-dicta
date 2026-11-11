import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsAllowedEmail } from 'src/shared/decorator/is-allowed-email.decorator';


export class RegisterUserDto {
  @ApiProperty({ example: 'Ana', description: 'Nombre (2 a 80 letras)', minLength: 2, maxLength: 80, required: false })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(2, { message: 'El nombre debe tener mínimo 2 caracteres' })
  @MaxLength(80, { message: 'El nombre debe tener máximo 80 caracteres' })
  nombre?: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido (hasta 80 letras)', maxLength: 80, required: false })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser texto' })
  @MaxLength(80, { message: 'El apellido debe tener máximo 80 caracteres' })
  apellido?: string;

  @ApiProperty({
    example: 'Jose',
    description: 'OBSOLETO: solo para clientes antiguos que todavía no mandan nombre y apellido (3 a 50 caracteres)',
    minLength: 3,
    maxLength: 50,
    required: false,
    deprecated: true,
  })
  @IsOptional()
  @IsString({ message: 'El username debe ser texto' })
  @MinLength(3, { message: 'El username debe tener mínimo 3 caracteres' })
  @MaxLength(50, { message: 'El username debe tener máximo 50 caracteres' })
  username?: string;

  @ApiProperty({
    example: 'jose@gmail.com',
    description: 'Correo del usuario (Gmail, Hotmail, Outlook o Yahoo)',
  })
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsAllowedEmail({ message: 'Dominio de correo no permitido' })
  email: string;

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


@ApiProperty({
  example: true,
  description: 'Aceptación de términos y condiciones',
  default: false,
})
@Transform(({ value }) => value === true || value === 'true')
@IsBoolean()
@IsNotEmpty({ message: 'La aceptación de términos es requerida' })
acceptTerms: boolean = false;
}
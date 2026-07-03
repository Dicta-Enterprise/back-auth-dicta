import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsAllowedEmail } from 'src/shared/decorator/is-allowed-email.decorator';


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
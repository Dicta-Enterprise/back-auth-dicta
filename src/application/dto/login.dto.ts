import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsAllowedEmail } from 'src/shared/decorator/is-allowed-email.decorator';

export class LoginDto {
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
      'Contraseña (mínimo 8 caracteres y un número)',
    minLength: 8,
    })
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    password: string;
}

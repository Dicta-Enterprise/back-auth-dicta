import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsAllowedEmail } from 'src/shared/decorator/is-allowed-email.decorator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'jose@gmail.com' })
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsAllowedEmail({ message: 'Dominio de correo no permitido' })
  email: string;
}
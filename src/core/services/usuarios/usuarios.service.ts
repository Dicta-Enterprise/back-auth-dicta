import { HttpStatus, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { USUARIO_REPOSITORY } from '../../constants/constants';
import { UsuarioRepository } from '../../repositories/usuario.repository';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { RegisterUserDto } from 'src/application/dto/register-user.dto';
import { Usuario } from '../../entities/auth/usuario.enity';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
import * as bcrypt from 'bcrypt';
import { GoogleLoginDto } from 'src/application/dto/google-login.dto';
import { MailerService } from 'src/core/services/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private repository: UsuarioRepository,
    private readonly validator: ValidatorService,
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  async crearUsuario(dtoUsuario: RegisterUserDto): Promise<Usuario> {
    await this.validator.validate(dtoUsuario, RegisterUserDto);

    if (dtoUsuario.confirmPassword !== dtoUsuario.password) {
      throw new BussinesRuleException(
        'Las contraseñas no coinciden',
        HttpStatus.BAD_REQUEST,
        { codigoError: 'PASSWORDS_NOT_MATCH' },
      );
    }

    const existeEmail = await this.repository.findByEmail(dtoUsuario.email);
    if (existeEmail) {
      throw new BussinesRuleException('El correo ya está registrado', HttpStatus.BAD_REQUEST);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dtoUsuario.password, salt);

    const usuario = new Usuario(
      null,
      dtoUsuario.username,
      dtoUsuario.email,
      hashedPassword,
      1,
      new Date(),
    );

    const creado = await this.repository.create(usuario);

    try {
      await this.mailerService.crearContacto({
        email: creado.email,
        nombre: creado.username,
      });

      await this.mailerService.enviar({
        to: creado.email,
        nombreUsuario: creado.username,
        subject: `¡Bienvenido a Dicta, ${creado.username}!`,
        templateId: this.config.get<number>('BREVO_TEMPLATE_BIENVENIDA'),
        context: {
          nombreUsuario: creado.username,
          urlPlataforma: `${this.config.get('FRONTEND_URL', '')}/auth/login`,
          year: new Date().getFullYear(),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error al enviar correo de bienvenida a ${creado.email}: ${error.message}`,
          error.stack,
        );
      }
    }

    return creado;
  }
    async crearUsuarioGoogle(dto: GoogleLoginDto): Promise<Usuario> {
    const existeGoogleId = await this.repository.findByGoogleId(dto.googleId);
    if (existeGoogleId) {
      return existeGoogleId;
    }

    const usuario = new Usuario(
      null,
      dto.username,
      dto.email,
      null,
      1,
      new Date(),
      'GOOGLE',
      dto.googleId,
    );

    const creado = await this.repository.create(usuario);

    try {
      await this.mailerService.crearContacto({
        email: creado.email,
        nombre: creado.username,
      });

      await this.mailerService.enviar({
        to: creado.email,
        nombreUsuario: creado.username,
        subject: `¡Bienvenido a Dicta, ${creado.username}!`,
        templateId: this.config.get<number>('BREVO_TEMPLATE_BIENVENIDA'),
        context: {
          nombreUsuario: creado.username,
          urlPlataforma: `${this.config.get('FRONTEND_URL', '')}/auth/login`,
          year: new Date().getFullYear(),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error al enviar correo de bienvenida a ${creado.email}: ${error.message}`,
          error.stack,
        );
      }
    }

    return creado;
  }

  async findByEmail(email: string): Promise<Usuario> {
    return this.repository.findByEmail(email);
  }
   async findByGoogleId(googleId: string): Promise<Usuario> {
    return this.repository.findByGoogleId(googleId);
  }
  async validateLocalUser(email: string, password: string): Promise<Usuario> {
  const usuario = await this.findByEmail(email);
  if (!usuario) throw new UnauthorizedException('Credenciales inválidas');
  if (usuario.authProvider === 'GOOGLE') throw new UnauthorizedException('Credenciales inválidas');
  const ok = await bcrypt.compare(password, usuario.password);
  if (!ok) throw new UnauthorizedException('Credenciales inválidas');

  return usuario;
}
}

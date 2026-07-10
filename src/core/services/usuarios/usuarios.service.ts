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
import { ResetPasswordDto } from 'src/application/dto/reset-password.dto';


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
      'LOCAL',
      null,
      null,
      dtoUsuario.acceptTerms
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

    await this.enviarCodigoVerificacion(creado);

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

  if (usuario.idrol === 4) {
    if (!usuario.verifyCodeExpires || usuario.verifyCodeExpires < new Date()) {
      await this.repository.eliminarUsuario(Number(usuario.id));
      this.logger.warn(`Usuario ${email} eliminado por registro expirado al intentar login`);
      throw new UnauthorizedException(
        'Tu registro ha expirado. Por favor regístrate nuevamente.',
      );
    }
    throw new UnauthorizedException('Debes verificar tu correo electrónico antes de iniciar sesión.');
  }

  return usuario;
}

async solicitarResetCodigo(email: string): Promise<void> {
  const usuario = await this.repository.findByEmail(email);
  if (!usuario) return;

  if (usuario.authProvider === 'GOOGLE') {
    throw new BussinesRuleException(
      'Esta cuenta usa Google. No puedes cambiar la contraseña aquí.',
      HttpStatus.BAD_REQUEST,
    );
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

  await this.repository.saveResetCode(Number(usuario.id), code, expires);

  try {
    await this.mailerService.enviar({
      to: usuario.email,
      nombreUsuario: usuario.username,
      subject: 'Código para restablecer tu contraseña',
      templateId: this.config.get<number>('BREVO_TEMPLATE_RESET_PASSWORD'),
      context: {
        nombreUsuario: usuario.username,
        resetCode: code,
        year: new Date().getFullYear(),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      this.logger.error(
        `Error al enviar código de reset a ${usuario.email}: ${error.message}`,
        error.stack,
      );
    }
  }
}

async verificarResetCodigo(email: string, code: string): Promise<void> {
  const usuario = await this.repository.findByEmail(email);

  if (!usuario || !usuario.resetCode) {
    throw new BussinesRuleException('Código inválido', HttpStatus.BAD_REQUEST);
  }

  // Verificar límite de intentos
  if (usuario.resetAttempts >= 5) {
    throw new BussinesRuleException(
      'Demasiados intentos fallidos. Solicita un nuevo código.',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }

  // Verificar expiración primero
  if (!usuario.resetCodeExpires || usuario.resetCodeExpires < new Date()) {
    throw new BussinesRuleException('El código ha expirado', HttpStatus.BAD_REQUEST);
  }

  // Verificar código — si es incorrecto, incrementar intentos
  if (usuario.resetCode !== code) {
    await this.repository.incrementResetAttempts(Number(usuario.id));
    this.logger.warn(
      `Intento fallido de reset para ${email}. Intentos: ${(usuario.resetAttempts ?? 0) + 1}/5`,
    );
    throw new BussinesRuleException('Código inválido', HttpStatus.BAD_REQUEST);
  }
}

async resetPassword(dto: ResetPasswordDto): Promise<void> {
  if (dto.newPassword !== dto.confirmPassword) {
    throw new BussinesRuleException(
      'Las contraseñas no coinciden',
      HttpStatus.BAD_REQUEST,
      { codigoError: 'PASSWORDS_NOT_MATCH' },
    );
  }

  await this.verificarResetCodigo(dto.email, dto.code);

  const usuario = await this.repository.findByEmail(dto.email);

  if (usuario.password) {
    const esMismaPassword = await bcrypt.compare(dto.newPassword, usuario.password);
    if (esMismaPassword) {
      throw new BussinesRuleException(
        'La nueva contraseña no puede ser igual a la anterior',
        HttpStatus.BAD_REQUEST,
        { codigoError: 'SAME_PASSWORD' },
      );
    }
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(dto.newPassword, salt);

  await this.repository.updatePassword(Number(usuario.id), hashedPassword);
  this.logger.log(`Contraseña actualizada para: ${dto.email}`);
}

async enviarCodigoVerificacion(usuario: Usuario): Promise<void> {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 1 * 60 * 1000); 

  await this.repository.saveVerifyCode(Number(usuario.id), code, expires);

  try {
    await this.mailerService.enviar({
      to: usuario.email,
      nombreUsuario: usuario.username,
      subject: 'Verifica tu correo electrónico',
      templateId: this.config.get<number>('BREVO_TEMPLATE_VERIFY_EMAIL'),
      context: {
        nombreUsuario: usuario.username,
        verifyCode: code,
        year: new Date().getFullYear(),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      this.logger.error(
        `Error al enviar código de verificación a ${usuario.email}: ${error.message}`,
        error.stack,
      );
    }
  }
}

async verificarEmail(email: string, code: string): Promise<void> {
  const usuario = await this.repository.findByEmail(email);

  if (!usuario || !usuario.verifyCode) {
    throw new BussinesRuleException('Código inválido', HttpStatus.BAD_REQUEST);
  }

  // Verificar límite de intentos
  if ((usuario.verifyAttempts ?? 0) >= 5) {
    await this.repository.eliminarUsuario(Number(usuario.id)); // 👈 eliminar
    this.logger.warn(`Usuario ${email} eliminado por demasiados intentos fallidos`);
    throw new BussinesRuleException(
      'Demasiados intentos fallidos. Por favor regístrate nuevamente.',
      HttpStatus.TOO_MANY_REQUESTS,
      { codigoError: 'TOO_MANY_ATTEMPTS' },
    );
  }

  // Verificar expiración — si expiró, eliminar usuario
  if (!usuario.verifyCodeExpires || usuario.verifyCodeExpires < new Date()) {
    await this.repository.eliminarUsuario(Number(usuario.id));
    this.logger.warn(`Usuario ${email} eliminado por código de verificación expirado`);
    throw new BussinesRuleException(
      'El código ha expirado. Por favor regístrate nuevamente.',
      HttpStatus.BAD_REQUEST,
      { codigoError: 'VERIFY_CODE_EXPIRED' },
    );
  }

  // Verificar código — si es incorrecto, incrementar intentos
  if (usuario.verifyCode !== code) {
    await this.repository.incrementVerifyAttempts(Number(usuario.id));
    this.logger.warn(
      `Intento fallido de verificación para ${email}. Intentos: ${(usuario.verifyAttempts ?? 0) + 1}/5`,
    );
    throw new BussinesRuleException('Código inválido', HttpStatus.BAD_REQUEST);
  }

  // Activar cuenta
  await this.repository.activarUsuario(Number(usuario.id));
  this.logger.log(`Correo verificado y cuenta activada para: ${email}`);
}
}

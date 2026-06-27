import { HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { USUARIO_REPOSITORY } from '../../constants/constants';
import { UsuarioRepository } from '../../repositories/usuario.repository';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { RegisterUserDto } from 'src/application/dto/register-user.dto';
import { Usuario } from '../../entities/auth/usuario.enity';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
import * as bcrypt from 'bcrypt';
import { GoogleLoginDto } from 'src/application/dto/google-login.dto';



@Injectable()
export class UsuariosService {
  constructor(
  @Inject(USUARIO_REPOSITORY)
  private repository: UsuarioRepository,
  private readonly validator: ValidatorService
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

    const salt= await bcrypt.genSalt(10);
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

    return this.repository.create(usuario);
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
      dto.googleId
    );

    return this.repository.create(usuario);
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

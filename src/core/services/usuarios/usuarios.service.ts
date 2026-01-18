import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { USUARIO_REPOSITORY } from '../../constants/constants';
import { UsuarioRepository } from '../../repositories/usuario.repository';
import { ValidatorService } from 'src/shared/application/validation/validator.service';
import { RegisterUserDto } from 'src/application/dto/register-user.dto';
import { Usuario } from '../../entities/usuario.enity';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
import * as bcrypt from 'bcrypt';



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

    const existeUsername = await this.repository.findByUsername(dtoUsuario.username);
    if (existeUsername) {
      throw new BussinesRuleException('El username ya está en uso', HttpStatus.BAD_REQUEST);
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
    );

    return this.repository.create(usuario);
  }
}

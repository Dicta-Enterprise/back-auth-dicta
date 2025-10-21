import { Inject, Injectable } from '@nestjs/common';
import { Result } from 'src/shared/domain/result/result';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../core/repositories/auth/user.repository';
import { UserService } from '../../../core/services/auth/users.service';
import { CreateUserDto } from '../../dto/auth/create-user.dto';
import { UserEntity } from '../../../core/entities/auth/user.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly userDomainService: UserService,
  ) {}

  /**
   * Ejecuta el caso de uso de registro de usuario
   * @param dto Datos de registro
   * @returns Result con usuario creado o error
   */
  async execute(dto: CreateUserDto): Promise<Result<UserEntity>> {
    try {
      // 1. Normalizar email
      const normalizedEmail = this.userDomainService.normalizeEmail(dto.email);

      // 2. Validar que el email no exista
      const existingUserByEmail =
        await this.userRepository.findByEmail(normalizedEmail);
      if (existingUserByEmail) {
        throw new BussinesRuleException(
          'Ya existe un usuario con este correo electrónico',
          409, // Conflict
        );
      }

      // 3. Validar que el username no exista
      const existingUserByUsername = await this.userRepository.findByUsername(
        dto.username,
      );
      if (existingUserByUsername) {
        throw new BussinesRuleException(
          'Ya existe un usuario con este nombre de usuario',
          409,
        );
      }

      // 4. Validar fortaleza de contraseña (adicional a DTO)
      this.userDomainService.validatePasswordStrength(dto.password);

      // 5. Hashear contraseña
      const hashedPassword = await this.userDomainService.hashPassword(
        dto.password,
      );

      // 6. Crear usuario en BD
      const user = await this.userRepository.create({
        username: dto.username,
        email: normalizedEmail,
        password: hashedPassword,
      });

      // 7. Retornar resultado exitoso
      return Result.ok(user);
    } catch (error) {
      // Si es una excepción de negocio, la relanzamos
      if (error instanceof BussinesRuleException) {
        return Result.fail(error);
      }

      // Cualquier otro error lo convertimos en BusinessRuleException
      return Result.fail(
        new BussinesRuleException(
          'Error al registrar usuario: ' + error.message,
          500,
        ),
      );
    }
  }
}

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BussinesRuleException('Formato de email inválido', 400);
    }
  }

  validatePasswordStrength(password: string): void {
    if (password.length < 8) {
      throw new BussinesRuleException(
        'La contraseña debe tener al menos 8 caracteres',
        400,
      );
    }

    if (!/(?=.*[a-z])/.test(password)) {
      throw new BussinesRuleException(
        'La contraseña debe contener al menos una letra minúscula',
        400,
      );
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      throw new BussinesRuleException(
        'La contraseña debe contener al menos una letra mayúscula',
        400,
      );
    }

    if (!/(?=.*\d)/.test(password)) {
      throw new BussinesRuleException(
        'La contraseña debe contener al menos un número',
        400,
      );
    }
  }

  normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }
}

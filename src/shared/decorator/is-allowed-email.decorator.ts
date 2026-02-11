import {
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

const ALLOWED_EMAIL_DOMAINS = [
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
  'live.com',
  'proton.me',
];

export function IsAllowedEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsAllowedEmail',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') return false;

          const domain = value.split('@')[1]?.toLowerCase();
          return ALLOWED_EMAIL_DOMAINS.includes(domain);
        },
        defaultMessage(): string {
          return 'El dominio del correo no está permitido';
        },
      },
    });
  };
}
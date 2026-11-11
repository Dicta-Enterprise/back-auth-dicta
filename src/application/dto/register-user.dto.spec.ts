import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterUserDto } from './register-user.dto';

const base = {
  email: 'ana@gmail.com',
  password: 'Clave1234!',
  confirmPassword: 'Clave1234!',
  acceptTerms: true,
};

const errores = async (datos: Record<string, unknown>) => {
  const dto = plainToInstance(RegisterUserDto, { ...base, ...datos });
  const resultado = await validate(dto);
  return resultado.map((e) => e.property);
};

describe('RegisterUserDto (nombre y apellido)', () => {
  it('acepta el registro nuevo con nombre y apellido', async () => {
    expect(await errores({ nombre: 'Ana', apellido: 'Pérez' })).toEqual([]);
  });

  it('acepta solo el nombre (el apellido es opcional por ahora)', async () => {
    expect(await errores({ nombre: 'Ana' })).toEqual([]);
  });

  it('un cliente antiguo que solo manda username sigue siendo válido', async () => {
    expect(await errores({ username: 'sofia_01' })).toEqual([]);
  });

  it('rechaza un nombre de 1 letra o de más de 80', async () => {
    expect(await errores({ nombre: 'A' })).toEqual(['nombre']);
    expect(await errores({ nombre: 'A'.repeat(81) })).toEqual(['nombre']);
  });

  it('rechaza un apellido de más de 80 caracteres', async () => {
    expect(await errores({ nombre: 'Ana', apellido: 'B'.repeat(81) })).toEqual(['apellido']);
  });

  it('si viene username, sigue exigiéndose de 3 a 50 caracteres', async () => {
    expect(await errores({ username: 'ab' })).toEqual(['username']);
    expect(await errores({ username: 'x'.repeat(51) })).toEqual(['username']);
  });

  it('el DTO deja pasar un registro sin ningún nombre: esa regla la aplica el servicio, que además sabe si se exige el apellido', async () => {
    expect(await errores({})).toEqual([]);
  });

  it('el resto de las reglas no cambió: correo inválido y contraseña débil', async () => {
    expect(await errores({ nombre: 'Ana', email: 'no-es-correo' })).toContain('email');
    expect(await errores({ nombre: 'Ana', password: 'sinnumero', confirmPassword: 'sinnumero' })).toContain('password');
  });
});

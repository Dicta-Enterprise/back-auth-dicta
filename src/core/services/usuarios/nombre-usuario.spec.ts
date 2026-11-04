import { nombreCompleto, nombreParaSaludo, resolverNombre } from './nombre-usuario';

const mensaje = (fn: () => unknown): string => {
  try {
    fn();
  } catch (e) {
    return (e as Error).message;
  }
  return '(no lanzó error)';
};

describe('resolverNombre', () => {
  it('con nombre y apellido arma el username como "nombre apellido"', () => {
    expect(resolverNombre({ nombre: 'Ana', apellido: 'Pérez' })).toEqual({ nombre: 'Ana', apellido: 'Pérez', username: 'Ana Pérez' });
  });

  it('acepta nombres reales: tildes, nombres compuestos, apóstrofos, guiones y apellidos con partículas', () => {
    expect(resolverNombre({ nombre: 'María José', apellido: 'O\'Connor-De la Cruz' }).apellido).toBe('O\'Connor-De la Cruz');
    expect(resolverNombre({ nombre: 'Íñigo', apellido: 'Núñez' }).nombre).toBe('Íñigo');
  });

  it('limpia espacios de más, al inicio, al final y en el medio', () => {
    expect(resolverNombre({ nombre: '  Ana   María ', apellido: '  Pérez  ' })).toMatchObject({ nombre: 'Ana María', apellido: 'Pérez', username: 'Ana María Pérez' });
  });

  it('sin apellido (por ahora es opcional) deja el apellido vacío y el username es solo el nombre', () => {
    expect(resolverNombre({ nombre: 'Ana' })).toEqual({ nombre: 'Ana', apellido: null, username: 'Ana' });
    expect(resolverNombre({ nombre: 'Ana', apellido: '   ' }).apellido).toBeNull();
  });

  it('un cliente antiguo que solo manda "username" sigue funcionando: ese texto pasa a ser el nombre', () => {
    expect(resolverNombre({ username: 'sofia_01' })).toEqual({ nombre: 'sofia_01', apellido: null, username: 'sofia_01' });
  });

  it('si mandan nombre y username, manda el nombre', () => {
    expect(resolverNombre({ nombre: 'Ana', apellido: 'Pérez', username: 'otro' }).username).toBe('Ana Pérez');
  });

  it('el username nunca pasa de 50 caracteres, que es lo que cabe en la columna', () => {
    const largo = resolverNombre({ nombre: 'A'.repeat(40), apellido: 'B'.repeat(40) });
    expect(largo.username.length).toBeLessThanOrEqual(50);
    expect(largo.nombre.length).toBe(40);
  });

  it('exige al menos un nombre', () => {
    expect(mensaje(() => resolverNombre({}))).toBe('Debes indicar tu nombre.');
    expect(mensaje(() => resolverNombre({ nombre: '   ', username: '' }))).toBe('Debes indicar tu nombre.');
  });

  it('rechaza nombres con números o símbolos, muy cortos o demasiado largos', () => {
    expect(mensaje(() => resolverNombre({ nombre: 'Ana2' }))).toMatch(/nombre debe tener/);
    expect(mensaje(() => resolverNombre({ nombre: 'A' }))).toMatch(/nombre debe tener/);
    expect(mensaje(() => resolverNombre({ nombre: '<script>' }))).toMatch(/nombre debe tener/);
    expect(mensaje(() => resolverNombre({ nombre: 'A'.repeat(81) }))).toMatch(/nombre debe tener/);
    expect(mensaje(() => resolverNombre({ nombre: 'Ana', apellido: 'Pérez 3' }))).toMatch(/apellido debe tener/);
  });

  describe('cuando Carlos confirme que nombre y apellido son obligatorios', () => {
    it('exige el apellido', () => {
      expect(mensaje(() => resolverNombre({ nombre: 'Ana' }, true))).toBe('Debes indicar tu apellido.');
      expect(resolverNombre({ nombre: 'Ana', apellido: 'Pérez' }, true).username).toBe('Ana Pérez');
    });

    it('un cliente antiguo con solo "username" ya no puede registrarse', () => {
      expect(mensaje(() => resolverNombre({ username: 'sofia_01' }, true))).toBe('Debes indicar tu nombre y tu apellido.');
    });
  });
});

describe('nombreCompleto y nombreParaSaludo', () => {
  it('un usuario nuevo se muestra con nombre y apellido', () => {
    const u = { nombre: 'Ana', apellido: 'Pérez', username: 'Ana Pérez' };
    expect(nombreCompleto(u)).toBe('Ana Pérez');
    expect(nombreParaSaludo(u)).toBe('Ana');
  });

  it('un usuario antiguo (sin nombre guardado) se muestra con su username', () => {
    const u = { nombre: null, apellido: null, username: 'sofia_01' };
    expect(nombreCompleto(u)).toBe('sofia_01');
    expect(nombreParaSaludo(u)).toBe('sofia_01');
  });

  it('sin apellido muestra solo el nombre', () => {
    expect(nombreCompleto({ nombre: 'Ana', apellido: null, username: 'Ana' })).toBe('Ana');
  });
});

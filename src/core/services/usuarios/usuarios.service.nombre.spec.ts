import { UsuariosService } from './usuarios.service';
import { Usuario } from '../../entities/auth/usuario.enity';

// Los servicios de correo y de configuración leen variables de entorno al importarse; en las pruebas no hacen falta.
jest.mock('src/config/envs', () => ({ envs: {} }));

const datosBase = { email: 'ana@gmail.com', password: 'Clave1234!', confirmPassword: 'Clave1234!', acceptTerms: true };

function crear() {
  const repository = {
    findByEmail: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation(async (u: Usuario) => Object.assign(new Usuario(u.id, u.username, u.email, u.password, u.estado, u.fechadecreacion), { id: '7', nombre: u.nombre, apellido: u.apellido })),
    saveVerifyCode: jest.fn().mockResolvedValue(undefined),
  };
  const validator = { validate: jest.fn().mockResolvedValue(undefined) };
  const mailer = { crearContacto: jest.fn().mockResolvedValue(undefined), enviar: jest.fn().mockResolvedValue(undefined) };
  const config = { get: jest.fn((_clave: string, porDefecto?: unknown) => porDefecto) };
  const service = new UsuariosService(repository as never, validator as never, mailer as never, config as never);
  return { service, repository, mailer };
}

describe('UsuariosService.crearUsuario (nombre y apellido)', () => {
  it('guarda nombre y apellido, arma el username y saluda con el nombre', async () => {
    const { service, repository, mailer } = crear();
    const creado = await service.crearUsuario({ ...datosBase, nombre: 'Ana', apellido: 'Pérez' } as never);

    const guardado = repository.create.mock.calls[0][0] as Usuario;
    expect(guardado).toMatchObject({ nombre: 'Ana', apellido: 'Pérez', username: 'Ana Pérez', email: 'ana@gmail.com' });
    expect(creado.nombre).toBe('Ana');
    expect(mailer.crearContacto).toHaveBeenCalledWith({ email: 'ana@gmail.com', nombre: 'Ana Pérez' });
    const bienvenida = mailer.enviar.mock.calls.find((c) => String(c[0].subject).includes('Bienvenido'))![0];
    expect(bienvenida.subject).toBe('¡Bienvenido a Dicta, Ana!');
    expect(bienvenida.nombreUsuario).toBe('Ana');
  });

  it('un cliente antiguo que solo manda username sigue registrándose: ese texto pasa a ser el nombre', async () => {
    const { service, repository } = crear();
    await service.crearUsuario({ ...datosBase, username: 'sofia_01' } as never);

    expect(repository.create.mock.calls[0][0]).toMatchObject({ nombre: 'sofia_01', apellido: null, username: 'sofia_01' });
  });

  it('sin ningún nombre falla ANTES de consultar la base de datos', async () => {
    const { service, repository } = crear();
    await expect(service.crearUsuario({ ...datosBase } as never)).rejects.toThrow('Debes indicar tu nombre.');

    expect(repository.findByEmail).not.toHaveBeenCalled();
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('un nombre inválido (con números) se rechaza sin crear el usuario', async () => {
    const { service, repository } = crear();
    await expect(service.crearUsuario({ ...datosBase, nombre: 'Ana2' } as never)).rejects.toThrow(/nombre debe tener/);

    expect(repository.create).not.toHaveBeenCalled();
  });

  it('si las contraseñas no coinciden, sigue fallando por eso (la regla de antes no cambió)', async () => {
    const { service } = crear();
    await expect(service.crearUsuario({ ...datosBase, confirmPassword: 'otra1234!', nombre: 'Ana' } as never)).rejects.toThrow('Las contraseñas no coinciden');
  });

  it('un correo ya registrado sigue rechazándose', async () => {
    const { service, repository } = crear();
    repository.findByEmail.mockResolvedValue({ id: '1' });
    await expect(service.crearUsuario({ ...datosBase, nombre: 'Ana' } as never)).rejects.toThrow('El correo ya está registrado');
  });
});

describe('UsuariosService.crearUsuarioGoogle (nombre y apellido)', () => {
  const google = { email: 'ana@gmail.com', googleId: 'g-1', username: 'Ana Pérez' };

  it('usa el nombre y el apellido que entrega Google', async () => {
    const { service, repository } = crear();
    repository.findByGoogleId = jest.fn().mockResolvedValue(null);
    await service.crearUsuarioGoogle({ ...google, nombre: 'Ana', apellido: 'Pérez' } as never);

    expect(repository.create.mock.calls[0][0]).toMatchObject({ nombre: 'Ana', apellido: 'Pérez', username: 'Ana Pérez' });
  });

  it('si Google no separa nombre y apellido, usa el nombre completo que muestra', async () => {
    const { service, repository } = crear();
    repository.findByGoogleId = jest.fn().mockResolvedValue(null);
    await service.crearUsuarioGoogle(google as never);

    expect(repository.create.mock.calls[0][0]).toMatchObject({ nombre: 'Ana Pérez', apellido: null, username: 'Ana Pérez' });
  });

  it('si Google trae un nombre con caracteres raros, no se rompe el ingreso', async () => {
    const { service, repository } = crear();
    repository.findByGoogleId = jest.fn().mockResolvedValue(null);
    await expect(service.crearUsuarioGoogle({ ...google, nombre: 'Ana 😀', apellido: 'Pérez' } as never)).resolves.toBeDefined();
  });
});

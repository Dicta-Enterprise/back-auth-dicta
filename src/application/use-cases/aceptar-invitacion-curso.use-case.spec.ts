import { AceptarInvitacionCursoUseCase } from './aceptar-invitacion-curso.use-case';

const dto = { token: 'tok-123', username: 'hijo', password: 'Clave1234!', confirmPassword: 'Clave1234!', acceptTerms: true };

const invitacionBase = () => ({
  id: 1,
  estado: 'PENDIENTE',
  fechaExpiracion: new Date(Date.now() + 24 * 60 * 60 * 1000),
  correo: 'hijo@correo.co',
  idCuentaAsociada: 9,
  cursoId: 'curso-1',
  cuentaAsociada: { idpadre: 3 },
});

function crear(opciones: { invitacion?: unknown; yaAsignado?: unknown } = {}) {
  const invitacionService = {
    buscarPorToken: jest.fn().mockResolvedValue('invitacion' in opciones ? opciones.invitacion : invitacionBase()),
    marcarExpirada: jest.fn().mockResolvedValue(undefined),
    marcarAceptada: jest.fn().mockResolvedValue(undefined),
  };
  const cuentaAsociadaService = {
    asociarUsuario: jest.fn().mockResolvedValue(undefined),
    cambiarEstado: jest.fn().mockResolvedValue(undefined),
  };
  const usuariosService = { crearUsuario: jest.fn().mockResolvedValue({ id: 50, username: 'hijo', email: 'hijo@correo.co' }) };
  const familiaService = { crearSiNoExiste: jest.fn().mockResolvedValue({ id: 1 }) };
  const cursoAsignadoService = {
    buscarPorCuentaYCurso: jest.fn().mockResolvedValue('yaAsignado' in opciones ? opciones.yaAsignado : null),
    crear: jest.fn().mockResolvedValue({ id: 1 }),
  };

  const useCase = new AceptarInvitacionCursoUseCase(
    invitacionService as never,
    cuentaAsociadaService as never,
    usuariosService as never,
    familiaService as never,
    cursoAsignadoService as never,
  );
  return { useCase, invitacionService, cuentaAsociadaService, usuariosService, familiaService, cursoAsignadoService };
}

describe('AceptarInvitacionCursoUseCase', () => {
  it('al aceptar: crea el usuario, activa la cuenta, crea la familia y asigna el curso', async () => {
    const { useCase, usuariosService, cuentaAsociadaService, invitacionService, familiaService, cursoAsignadoService } = crear();
    const r = await useCase.execute(dto);

    expect(r.isFailure).toBe(false);
    expect(usuariosService.crearUsuario).toHaveBeenCalledWith(expect.objectContaining({ email: 'hijo@correo.co', username: 'hijo' }));
    expect(cuentaAsociadaService.asociarUsuario).toHaveBeenCalledWith(9, 50);
    expect(cuentaAsociadaService.cambiarEstado).toHaveBeenCalledWith(9, 'ACTIVA');
    expect(invitacionService.marcarAceptada).toHaveBeenCalledWith(1);
    expect(familiaService.crearSiNoExiste).toHaveBeenCalledWith(3);
    expect(cursoAsignadoService.crear).toHaveBeenCalledWith(9, 'curso-1');
    expect(r.getValue()).toEqual({ usuario: { id: 50, username: 'hijo', email: 'hijo@correo.co' }, idCuentaAsociada: 9 });
  });

  it('si el curso ya estaba asignado a esa cuenta, no lo asigna otra vez', async () => {
    const { useCase, cursoAsignadoService } = crear({ yaAsignado: { id: 7 } });
    await useCase.execute(dto);

    expect(cursoAsignadoService.crear).not.toHaveBeenCalled();
  });

  it('si la invitación no tiene padre, no intenta crear familia pero sigue con lo demás', async () => {
    const { useCase, familiaService, cursoAsignadoService } = crear({ invitacion: { ...invitacionBase(), cuentaAsociada: null } });
    const r = await useCase.execute(dto);

    expect(r.isFailure).toBe(false);
    expect(familiaService.crearSiNoExiste).not.toHaveBeenCalled();
    expect(cursoAsignadoService.crear).toHaveBeenCalled();
  });

  it('rechaza una invitación que no existe, sin crear nada', async () => {
    const { useCase, usuariosService } = crear({ invitacion: null });
    const r = await useCase.execute(dto);

    expect(r.isFailure).toBe(true);
    expect(r.error.message).toBe('La invitación no existe.');
    expect(usuariosService.crearUsuario).not.toHaveBeenCalled();
  });

  it.each(['CANCELADA', 'ACEPTADA'])('rechaza una invitación %s', async (estado) => {
    const { useCase, usuariosService } = crear({ invitacion: { ...invitacionBase(), estado } });
    const r = await useCase.execute(dto);

    expect(r.isFailure).toBe(true);
    expect(r.error.message).toBe('Esta invitación ya no está disponible.');
    expect(usuariosService.crearUsuario).not.toHaveBeenCalled();
  });

  it('una invitación vencida se marca como expirada y no crea nada', async () => {
    const vencida = { ...invitacionBase(), fechaExpiracion: new Date(Date.now() - 1000) };
    const { useCase, invitacionService, usuariosService, cursoAsignadoService } = crear({ invitacion: vencida });
    const r = await useCase.execute(dto);

    expect(r.isFailure).toBe(true);
    expect(r.error.message).toBe('El token de invitación ha expirado.');
    expect(invitacionService.marcarExpirada).toHaveBeenCalledWith(1);
    expect(usuariosService.crearUsuario).not.toHaveBeenCalled();
    expect(cursoAsignadoService.crear).not.toHaveBeenCalled();
  });

  it('si ya estaba marcada como expirada no la marca de nuevo', async () => {
    const { useCase, invitacionService } = crear({ invitacion: { ...invitacionBase(), estado: 'EXPIRADA' } });
    const r = await useCase.execute(dto);

    expect(r.isFailure).toBe(true);
    expect(invitacionService.marcarExpirada).not.toHaveBeenCalled();
  });

  it('si no se puede crear el usuario (por ejemplo, el correo ya existe), falla y no activa nada', async () => {
    const { useCase, usuariosService, cuentaAsociadaService, invitacionService } = crear();
    usuariosService.crearUsuario.mockRejectedValue(new Error('El correo ya está registrado'));
    const r = await useCase.execute(dto);

    expect(r.isFailure).toBe(true);
    expect(r.error.message).toBe('El correo ya está registrado');
    expect(cuentaAsociadaService.cambiarEstado).not.toHaveBeenCalled();
    expect(invitacionService.marcarAceptada).not.toHaveBeenCalled();
  });
});

import { EnviarInvitacionCursoUseCase } from './enviar-invitacion-curso.use-case';

// El archivo de configuración valida las variables de entorno al importarse; en las pruebas no hacen falta.
jest.mock('src/config/envs', () => ({ envs: { transactionApiUrl: 'http://localhost:3001' } }));

const dto = { idCuentaAsociada: 5, correo: 'hijo@correo.co', cursoId: 'curso-1' };

function crear(opciones: { cuenta?: unknown; comprados?: jest.Mock; correo?: jest.Mock } = {}) {
  const invitacionService = { crear: jest.fn().mockResolvedValue({ correo: dto.correo, token: 'tok-123' }) };
  const cuentaAsociadaService = {
    obtenerCuentaPorIdYPadre: jest.fn().mockResolvedValue('cuenta' in opciones ? opciones.cuenta : { id: 5 }),
  };
  const mailerService = { enviar: opciones.correo ?? jest.fn().mockResolvedValue(undefined) };
  const config = { get: jest.fn((_clave: string, porDefecto?: unknown) => porDefecto) };
  const transactionApiService = { obtenerCursosComprados: opciones.comprados ?? jest.fn().mockResolvedValue(['curso-1', 'curso-2']) };

  const useCase = new EnviarInvitacionCursoUseCase(
    invitacionService as never,
    cuentaAsociadaService as never,
    mailerService as never,
    config as never,
    transactionApiService as never,
  );
  return { useCase, invitacionService, cuentaAsociadaService, mailerService, transactionApiService };
}

describe('EnviarInvitacionCursoUseCase', () => {
  it('invita y manda el correo cuando el curso ya fue comprado por el padre', async () => {
    const { useCase, invitacionService, mailerService, transactionApiService } = crear();
    const r = await useCase.execute(dto, 3);

    expect(r.isFailure).toBe(false);
    expect(transactionApiService.obtenerCursosComprados).toHaveBeenCalledWith(3);
    expect(invitacionService.crear).toHaveBeenCalledWith({ idCuentaAsociada: 5, correo: dto.correo, cursoId: 'curso-1' });
    expect(mailerService.enviar).toHaveBeenCalledTimes(1);
  });

  it('no deja invitar con un curso que el padre no ha comprado', async () => {
    const { useCase, invitacionService, mailerService } = crear({ comprados: jest.fn().mockResolvedValue(['curso-9']) });
    const r = await useCase.execute(dto, 3);

    expect(r.isFailure).toBe(true);
    expect(r.error.message).toBe('No has comprado este curso, no se puede enviar la invitación.');
    expect(invitacionService.crear).not.toHaveBeenCalled();
    expect(mailerService.enviar).not.toHaveBeenCalled();
  });

  it('un padre sin ninguna compra tampoco puede invitar', async () => {
    const { useCase, invitacionService } = crear({ comprados: jest.fn().mockResolvedValue([]) });
    expect((await useCase.execute(dto, 3)).isFailure).toBe(true);
    expect(invitacionService.crear).not.toHaveBeenCalled();
  });

  it('si la cuenta no es de ese padre, falla sin consultar las compras', async () => {
    const { useCase, transactionApiService, invitacionService } = crear({ cuenta: null });
    const r = await useCase.execute(dto, 3);

    expect(r.isFailure).toBe(true);
    expect(r.error.message).toBe('Cuenta asociada no encontrada o no autorizada.');
    expect(transactionApiService.obtenerCursosComprados).not.toHaveBeenCalled();
    expect(invitacionService.crear).not.toHaveBeenCalled();
  });

  it('si back-transaction no responde, no se invita (no se puede comprobar la compra)', async () => {
    const { useCase, invitacionService } = crear({ comprados: jest.fn().mockRejectedValue(new Error('caído')) });
    const r = await useCase.execute(dto, 3);

    expect(r.isFailure).toBe(true);
    expect(invitacionService.crear).not.toHaveBeenCalled();
  });

  it('si el correo falla, la invitación igual queda creada', async () => {
    const { useCase } = crear({ correo: jest.fn().mockRejectedValue(new Error('Brevo caído')) });
    const r = await useCase.execute(dto, 3);

    expect(r.isFailure).toBe(false);
  });
});

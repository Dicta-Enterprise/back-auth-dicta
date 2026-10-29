import { GetMiFamiliaUseCase } from './get-mi-familia.use-case';
import { UpdateNombreFamiliaUseCase } from './update-nombre-familia.use-case';

const fecha = new Date('2026-09-12T10:00:00.000Z');

describe('GetMiFamiliaUseCase', () => {
  it('devuelve id, nombre y fecha de creación de la familia del padre', async () => {
    const familiaService = { obtenerPorPadre: jest.fn().mockResolvedValue({ id: 4, nombre: 'Familia Pérez', fechacreacion: fecha, idpadre: 3 }) };
    const r = await new GetMiFamiliaUseCase(familiaService as never).execute(3);

    expect(familiaService.obtenerPorPadre).toHaveBeenCalledWith(3);
    expect(r.getValue()).toEqual({ id: 4, nombre: 'Familia Pérez', fechacreacion: fecha });
  });

  it('si el padre todavía no tiene familia, lo dice', async () => {
    const familiaService = { obtenerPorPadre: jest.fn().mockResolvedValue(null) };
    const r = await new GetMiFamiliaUseCase(familiaService as never).execute(3);

    expect(r.isFailure).toBe(true);
    expect(r.error.message).toBe('Aún no tienes una familia creada.');
  });

  it('un error inesperado no se filtra al cliente', async () => {
    const familiaService = { obtenerPorPadre: jest.fn().mockRejectedValue(new Error('detalle interno de la base')) };
    const r = await new GetMiFamiliaUseCase(familiaService as never).execute(3);

    expect(r.isFailure).toBe(true);
    expect(r.error.message).toBe('Ocurrió un error desconocido al obtener la familia.');
  });
});

describe('UpdateNombreFamiliaUseCase', () => {
  it('renombra la familia del padre y devuelve el dato actualizado', async () => {
    const familiaService = {
      obtenerPorPadre: jest.fn().mockResolvedValue({ id: 4 }),
      actualizarNombre: jest.fn().mockResolvedValue({ id: 4, nombre: 'Los Pérez', fechacreacion: fecha }),
    };
    const r = await new UpdateNombreFamiliaUseCase(familiaService as never).execute(3, { nombre: 'Los Pérez' });

    expect(familiaService.actualizarNombre).toHaveBeenCalledWith(3, 'Los Pérez');
    expect(r.getValue()).toEqual({ id: 4, nombre: 'Los Pérez', fechacreacion: fecha });
  });

  it('no renombra si el padre no tiene familia', async () => {
    const familiaService = { obtenerPorPadre: jest.fn().mockResolvedValue(null), actualizarNombre: jest.fn() };
    const r = await new UpdateNombreFamiliaUseCase(familiaService as never).execute(3, { nombre: 'Los Pérez' });

    expect(r.isFailure).toBe(true);
    expect(r.error.message).toBe('Aún no tienes una familia creada.');
    expect(familiaService.actualizarNombre).not.toHaveBeenCalled();
  });
});

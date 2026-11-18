import { ActualizarTipoUsuarioFamiliaUseCase } from './actualizar-tipo-usuario-familia.use-case';
import { FamiliaService } from 'src/core/services/familia/familia.service';
import { Familia } from 'src/core/entities/familia/familia.entity';

const familia = (tipo: 'FREE' | 'PREMIUM') => new Familia(1, 7, 'Familia García', new Date('2026-09-12'), tipo);

describe('ActualizarTipoUsuarioFamiliaUseCase', () => {
  it('sube la familia a PREMIUM y devuelve la familia actualizada', async () => {
    const service = { actualizarTipoUsuario: jest.fn().mockResolvedValue(familia('PREMIUM')) };
    const result = await new ActualizarTipoUsuarioFamiliaUseCase(service as unknown as FamiliaService).execute(7, 'PREMIUM');

    expect(service.actualizarTipoUsuario).toHaveBeenCalledWith(7, 'PREMIUM');
    expect(result.getValue().tipoUsuario).toBe('PREMIUM');
  });

  it('puede devolverla a FREE', async () => {
    const service = { actualizarTipoUsuario: jest.fn().mockResolvedValue(familia('FREE')) };
    const result = await new ActualizarTipoUsuarioFamiliaUseCase(service as unknown as FamiliaService).execute(7, 'FREE');

    expect(result.getValue().tipoUsuario).toBe('FREE');
  });

  it('falla si el padre todavía no tiene familia (no se crea una solo por comprar)', async () => {
    const service = { actualizarTipoUsuario: jest.fn().mockResolvedValue(null) };
    const result = await new ActualizarTipoUsuarioFamiliaUseCase(service as unknown as FamiliaService).execute(99, 'PREMIUM');

    expect(result.isFailure).toBe(true);
    expect(result.error.message).toContain('aún no tiene una familia');
  });

  it('si el servicio lanza un error, lo devuelve como fallo', async () => {
    const service = { actualizarTipoUsuario: jest.fn().mockRejectedValue(new Error('base caída')) };
    const result = await new ActualizarTipoUsuarioFamiliaUseCase(service as unknown as FamiliaService).execute(7, 'PREMIUM');

    expect(result.isFailure).toBe(true);
  });
});

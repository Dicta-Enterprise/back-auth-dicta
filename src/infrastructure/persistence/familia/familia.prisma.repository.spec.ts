import { FamiliaPrismaRepository } from './familia.prisma.repository';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

const fila = (tipo: string) => ({ id: 1, idpadre: 7, nombre: null, fechacreacion: new Date('2026-09-12'), tipo_usuario: tipo });

describe('FamiliaPrismaRepository.actualizarTipoUsuario', () => {
  it('actualiza solo la familia de ese padre y devuelve el tipo nuevo', async () => {
    const prisma = {
      familia: { updateMany: jest.fn().mockResolvedValue({ count: 1 }), findUnique: jest.fn().mockResolvedValue(fila('PREMIUM')) },
    };
    const repo = new FamiliaPrismaRepository(prisma as unknown as PrismaService);

    const resultado = await repo.actualizarTipoUsuario(7, 'PREMIUM');

    expect(prisma.familia.updateMany).toHaveBeenCalledWith({ where: { idpadre: 7 }, data: { tipo_usuario: 'PREMIUM' } });
    expect(resultado?.tipoUsuario).toBe('PREMIUM');
  });

  it('devuelve null (y no crea nada) si el padre no tiene familia', async () => {
    const prisma = { familia: { updateMany: jest.fn().mockResolvedValue({ count: 0 }), findUnique: jest.fn() } };
    const repo = new FamiliaPrismaRepository(prisma as unknown as PrismaService);

    expect(await repo.actualizarTipoUsuario(99, 'PREMIUM')).toBeNull();
    expect(prisma.familia.findUnique).not.toHaveBeenCalled();
  });

  it('un valor desconocido en la base se lee como FREE', async () => {
    const prisma = { familia: { findUnique: jest.fn().mockResolvedValue(fila('OTRO')) } };
    const repo = new FamiliaPrismaRepository(prisma as unknown as PrismaService);

    expect((await repo.findByPadre(7))?.tipoUsuario).toBe('FREE');
  });
});

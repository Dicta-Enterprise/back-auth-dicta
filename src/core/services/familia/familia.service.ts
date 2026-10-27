import { Inject, Injectable } from '@nestjs/common';
import { FAMILIA_REPOSITORY } from 'src/core/constants/constants';
import { Familia } from 'src/core/entities/familia/familia.entity';
import { FamiliaConMiembros } from 'src/core/entities/familia/familia-con-miembros.entity';
import { FamiliaRepository } from 'src/core/repositories/familia.repository';

@Injectable()
export class FamiliaService {
  constructor(
    @Inject(FAMILIA_REPOSITORY)
    private readonly repository: FamiliaRepository,
  ) {}

  async obtenerPorPadre(idpadre: number): Promise<Familia | null> {
    return this.repository.findByPadre(idpadre);
  }

  async crearSiNoExiste(idpadre: number): Promise<Familia> {
    const existente = await this.repository.findByPadre(idpadre);
    if (existente) {
      return existente;
    }
    return this.repository.crear(idpadre);
  }

  async actualizarNombre(idpadre: number, nombre: string): Promise<Familia> {
    return this.repository.actualizarNombre(idpadre, nombre);
  }

  async listarConMiembros(): Promise<FamiliaConMiembros[]> {
    return this.repository.listarConMiembros();
  }

  async obtenerConMiembrosPorPadre(idpadre: number): Promise<FamiliaConMiembros | null> {
    return this.repository.findConMiembrosPorPadre(idpadre);
  }
}

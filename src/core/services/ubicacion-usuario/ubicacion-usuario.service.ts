import { HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UBICACION_USUARIO_REPOSITORY } from 'src/core/constants/constants';
import { UbicacionUsuario } from 'src/core/entities/ubicacion-usuario/ubicacion-usuario.entity';
import { UbicacionUsuarioRepository } from 'src/core/repositories/ubicacion-usuario.repository';
import { BussinesRuleException } from 'src/shared/domain/exceptions/business-rule.exception';
import { GeoService } from '../geo/geo.service';

@Injectable()
export class UbicacionUsuarioService {
  constructor(
    @Inject(UBICACION_USUARIO_REPOSITORY)
    private readonly repository: UbicacionUsuarioRepository,
    private readonly geoService: GeoService,
  ) {}

  async obtenerUbicacion(idusuario: number): Promise<UbicacionUsuario> {
    const ubicacion = await this.repository.findByUsuario(idusuario);
    if (!ubicacion) {
      throw new NotFoundException('No se ha registrado una ubicación para este usuario');
    }
    return ubicacion;
  }

  async obtenerUbicacionOpcional(idusuario: number): Promise<UbicacionUsuario | null> {
    return this.repository.findByUsuario(idusuario);
  }

  async detectarYActualizar(idusuario: number, ip: string | null): Promise<UbicacionUsuario> {
    if (!ip) {
      throw new BussinesRuleException(
        'No se pudo determinar la dirección IP de la petición',
        HttpStatus.BAD_REQUEST,
      );
    }

    const geo = this.geoService.resolve(ip);

    if (!geo.countryCode) {
      throw new BussinesRuleException(
        'No se pudo determinar la ubicación a partir de la IP',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const idpais = geo.countryName
      ? await this.repository.findPaisIdByNombre(geo.countryName)
      : null;

    return this.repository.upsert(idusuario, {
      idpais,
      ciudad: geo.city,
      zonaHoraria: geo.zonaHoraria,
    });
  }

  async actualizarDesdeIp(idusuario: number, ip: string): Promise<UbicacionUsuario> {
    const geo = this.geoService.resolve(ip);
    const actual = await this.repository.findByUsuario(idusuario);

    if (!geo.countryCode) {
      if (actual) {
        return actual;
      }
      throw new BussinesRuleException(
        'No se pudo determinar la ubicación a partir de la IP registrada',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const idpaisResuelto = geo.countryName
      ? await this.repository.findPaisIdByNombre(geo.countryName)
      : null;

    return this.repository.upsert(idusuario, {
      idpais: idpaisResuelto ?? actual?.idpais ?? null,
      ciudad: geo.city ?? actual?.ciudad ?? null,
      zonaHoraria: geo.zonaHoraria ?? actual?.zonaHoraria ?? null,
    });
  }
}

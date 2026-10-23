import { Injectable } from '@nestjs/common';
import { GeoService } from 'src/core/services/geo/geo.service';
import { Result } from 'src/shared/domain/result/result';

export interface UbicacionDeIp {
  pais: string | null;
  ciudad: string | null;
  zonaHoraria: string | null;
}

/** Traduce una IP a país, ciudad y zona horaria. No guarda nada: lo usa back-transaction para ubicar cada compra. */
@Injectable()
export class GeolocalizarIpUseCase {
  constructor(private readonly geoService: GeoService) {}

  execute(ip: string): Result<UbicacionDeIp> {
    try {
      const geo = this.geoService.resolve(ip);
      return Result.ok<UbicacionDeIp>({
        pais: geo.countryName,
        ciudad: geo.city,
        zonaHoraria: geo.zonaHoraria,
      });
    } catch (error) {
      return Result.fail(error);
    }
  }
}

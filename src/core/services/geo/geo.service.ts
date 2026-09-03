import { Injectable } from '@nestjs/common';
import * as geoip from 'geoip-lite';
import * as countries from 'i18n-iso-countries';

// eslint-disable-next-line @typescript-eslint/no-require-imports
countries.registerLocale(require('i18n-iso-countries/langs/es.json'));

export interface GeoLocationResult {
  countryCode: string | null;
  countryName: string | null;
  city: string | null;
  zonaHoraria: string | null;
}

@Injectable()
export class GeoService {
  resolve(ip: string): GeoLocationResult {
    const geo = geoip.lookup(ip);

    if (!geo || !geo.country) {
      return { countryCode: null, countryName: null, city: null, zonaHoraria: null };
    }

    return {
      countryCode: geo.country,
      countryName: countries.getName(geo.country, 'es') ?? null,
      city: geo.city ? geo.city : null,
      zonaHoraria: geo.timezone ? geo.timezone : null,
    };
  }
}

import { GeolocalizarIpUseCase } from './geolocalizar-ip.use-case';
import { GeoService } from 'src/core/services/geo/geo.service';

describe('GeolocalizarIpUseCase', () => {
  it('devuelve país, ciudad y zona horaria de la IP', () => {
    const geo = {
      resolve: jest.fn().mockReturnValue({ countryCode: 'CO', countryName: 'Colombia', city: 'Bogotá', zonaHoraria: 'America/Bogota' }),
    };
    const result = new GeolocalizarIpUseCase(geo as unknown as GeoService).execute('181.49.10.20');

    expect(geo.resolve).toHaveBeenCalledWith('181.49.10.20');
    expect(result.getValue()).toEqual({ pais: 'Colombia', ciudad: 'Bogotá', zonaHoraria: 'America/Bogota' });
  });

  it('si no reconoce la IP responde con todo en null en lugar de fallar', () => {
    const geo = { resolve: jest.fn().mockReturnValue({ countryCode: null, countryName: null, city: null, zonaHoraria: null }) };
    const result = new GeolocalizarIpUseCase(geo as unknown as GeoService).execute('10.0.0.1');

    expect(result.isFailure).toBe(false);
    expect(result.getValue()).toEqual({ pais: null, ciudad: null, zonaHoraria: null });
  });

  it('si el servicio de geolocalización lanza un error, lo devuelve como fallo', () => {
    const geo = {
      resolve: jest.fn().mockImplementation(() => {
        throw new Error('base de geolocalización no disponible');
      }),
    };
    const result = new GeolocalizarIpUseCase(geo as unknown as GeoService).execute('181.49.10.20');

    expect(result.isFailure).toBe(true);
  });
});

import { Injectable, Logger } from '@nestjs/common';
import { envs } from 'src/config/envs';

interface OrdenIpResponse {
  data: { idusuario: number; ip: string | null };
  message: string;
}

@Injectable()
export class TransactionApiService {
  private readonly logger = new Logger(TransactionApiService.name);
  private readonly baseUrl = envs.transactionApiUrl;

  async obtenerIpRegistrada(idusuario: number): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/orders/${idusuario}/ip`);

      if (!response.ok) {
        this.logger.warn(
          `Back Transacción respondió ${response.status} al consultar la IP de idusuario=${idusuario}`,
        );
        return null;
      }

      const body = (await response.json()) as OrdenIpResponse;
      return body?.data?.ip ?? null;
    } catch (error) {
      this.logger.error(
        `No se pudo conectar con Back Transacción para consultar la IP de idusuario=${idusuario}: ${
          error instanceof Error ? error.message : 'error desconocido'
        }`,
      );
      return null;
    }
  }
}

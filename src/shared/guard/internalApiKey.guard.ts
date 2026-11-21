import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'crypto';
import { envs } from 'src/config/envs';

export const INTERNAL_API_KEY_HEADER = 'x-internal-api-key';

const hash = (valor: string) => createHash('sha256').update(valor).digest();

// Protege los endpoints /internal: solo otros servicios de Dicta (que conocen la clave) pueden llamarlos.
@Injectable()
export class InternalApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const enviada = request.headers?.[INTERNAL_API_KEY_HEADER];

    if (typeof enviada !== 'string' || !enviada) {
      throw new UnauthorizedException('Falta la clave interna.');
    }

    // Se comparan los hashes para que ambos midan lo mismo y la comparación no filtre información por tiempo.
    if (!timingSafeEqual(hash(enviada), hash(envs.internalApiKey))) {
      throw new UnauthorizedException('Clave interna inválida.');
    }

    return true;
  }
}

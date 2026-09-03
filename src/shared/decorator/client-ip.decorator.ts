import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClientIp = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    const forwardedFor = request.headers['x-forwarded-for'];

    const rawIp = forwardedFor
      ? String(forwardedFor).split(',')[0].trim()
      : request.socket?.remoteAddress;

    if (!rawIp) {
      return null;
    }

    return rawIp.startsWith('::ffff:') ? rawIp.substring(7) : rawIp;
  },
);

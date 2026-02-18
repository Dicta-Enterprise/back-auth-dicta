import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class jwtAuthGuard extends AuthGuard('jwt') {
    handleRequest<TUser = unknown>(err: unknown, user: TUser, info: unknown): TUser {

        if (info instanceof TokenExpiredError) {
        throw new UnauthorizedException('El token ha expirado. Inicia sesión nuevamente.');
        }

        if (err || !user) {
            throw new UnauthorizedException('No autenticado');
        }
        return user;
    }
}

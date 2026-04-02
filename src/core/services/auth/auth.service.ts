import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
 constructor(private readonly jwtService: JwtService) {}

 generateAccessToken(user: { id: string; email: string, idrol: number }){
  return this.jwtService.sign({
    sub: user.id,
    email: user.email,
    idrol: user.idrol
  });
}
}
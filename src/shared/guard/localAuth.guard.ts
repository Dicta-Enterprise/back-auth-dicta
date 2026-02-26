import { ExecutionContext, Injectable, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from 'src/application/dto/login.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly pipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const dto = plainToInstance(LoginDto, req.body);
    await this.pipe.transform(dto, {
      type: 'body',
      metatype: LoginDto,
    });

    return super.canActivate(context) as Promise<boolean>;
  }
}
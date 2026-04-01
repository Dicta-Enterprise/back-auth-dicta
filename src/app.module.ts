import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './infrastructure/http/auth/auth.module';
import { PerfilModule } from './infrastructure/http/perfil/perfil.module';
import { AccesosModule } from './infrastructure/http/acceso/accesos.module';

@Module({
  imports: [AuthModule, PerfilModule, AccesosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

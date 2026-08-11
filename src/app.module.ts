import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './infrastructure/http/auth/auth.module';
import { PerfilModule } from './infrastructure/http/perfil/perfil.module';
import { AccesosModule } from './infrastructure/http/acceso/accesos.module';
import { RolesModule } from './infrastructure/http/rol/roles.module';
import { PermisosModule } from './infrastructure/http/permisos/permisos.module';
//import { CursosModule } from './infrastructure/http/cursos/cursos.module';
import { FamiliaModule } from './infrastructure/http/familia/familia.module';
import { CuentasAsociadasModule } from './infrastructure/http/cuentas-asociadas/cuentas-asociadas.module';
import { CursosAsignadosModule } from './infrastructure/http/cursos-asignados/cursos-asignados.module';

@Module({
  imports: [
    AuthModule,
    PerfilModule,
    AccesosModule,
    RolesModule,
    PermisosModule,
    //CursosModule,
    FamiliaModule,
    CuentasAsociadasModule,
    CursosAsignadosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


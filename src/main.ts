import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import * as cookieParser from 'cookie-parser';


// Orígenes que pueden llamar a esta API desde el navegador (el panel de administración, el sitio público...).
// El panel en desarrollo corre en http://localhost:4200; se pueden sumar más con CORS_ORIGINS (separados por comas).
const ORIGENES_POR_DEFECTO = [
  'https://localhost:58863',
  'https://localhost:4200',
  'http://localhost:4200',
];

function origenesPermitidos(): string[] {
  const extra = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  return [...new Set([...ORIGENES_POR_DEFECTO, ...extra])];
}

async function bootstrap() {
  const logger = new Logger('API');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.use(cookieParser());
  
app.enableCors({
    origin: origenesPermitidos(),
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,PATCH',
  }); 

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  const config = new DocumentBuilder()
    .setTitle('API Universo Dicta')
    .setDescription('API de la aplicacion de universo dicta')
    .setVersion('1.0')
    // .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  app.use(
    '/api/scalar',
    apiReference({
      content: document,
    }),
  );
  await app.listen(envs.port);

   logger.log(`API corriendo en http://localhost:${envs.port}/api`);
  logger.log(`Swagger: http://localhost:${envs.port}/api/swagger`);
  logger.log(`Scalar:  http://localhost:${envs.port}/api/scalar`);
  logger.log(`api corriendo en la bd ${envs.databaseUrl}`);
}
bootstrap();

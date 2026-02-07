import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const logger = new Logger('API');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
    methods: 'GET,PUT,POST,DELETE,PATCH',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
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

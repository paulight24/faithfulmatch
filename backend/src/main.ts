import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefix all backend routes with `/api`
  app.setGlobalPrefix('api');

  // Serve frontend static files
  app.use(express.static(join(__dirname, '..', 'public')));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();


// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{cors: true});
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  app.useStaticAssets('public');
  await app.listen(3000);
}
bootstrap();

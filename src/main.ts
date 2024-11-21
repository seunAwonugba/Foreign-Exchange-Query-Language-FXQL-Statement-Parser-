import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get('port');
  const host = configService.get('host');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(port, host);
}
bootstrap();

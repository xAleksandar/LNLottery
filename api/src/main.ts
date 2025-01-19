import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { RefreshTokenMiddleware } from './middlewares/refresh.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.use(new RefreshTokenMiddleware().use);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://10.0.0.100:3000',
      'http://0.0.0.0:3000',
    ], // @@ Replace with your domain
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import 'reflect-metadata';
import helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(helmet());
  app.enableCors({ origin: 'http://localhost:4200', credentials: true });
  app.use(bodyParser.json());
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();

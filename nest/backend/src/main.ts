import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import 'reflect-metadata';
import helmet from 'helmet';
import * as crypto from 'crypto';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            'https://www.google.com/recaptcha/',
            'https://www.gstatic.com/recaptcha/',
          ],
          frameSrc: [
            "'self'",
            'https://www.google.com/recaptcha/',
            'https://www.gstatic.com/recaptcha/',
          ],
          imgSrc: [
            "'self'",
            'https://nutritionix-api.s3.amazonaws.com',
            'https://assets.syndigo.com',
            'https://nix-tag-images.s3.amazonaws.com',
            'https://d2eawub7utcl6.cloudfront.net/images/',
          ],
          connectSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          fontSrc: ["'self'"],
        },
      },
    }),
  );
  app.enableCors({ origin: 'http://localhost:4200', credentials: true });

  app.use(bodyParser.json());
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();

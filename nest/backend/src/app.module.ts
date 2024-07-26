import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardsModule } from './guards/guards.module';
import { EntitiesModule } from './entities/entities.module';
import { User } from './entities/user/user';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { ConfigModule } from '@nestjs/config';
import { CrpytoModule } from './crpyto/crpyto.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './authentication/authentication-service/authentication-service';
import { AuthenticationModule } from './authentication/authentication.module';
import { BmiModule } from './bmi/bmi.module';
import { Bmientry } from './entities/bmientry/bmientry';
import { DecoratorsModule } from './decorators/decorators.module';
import { DtosModule } from './dtos/dtos.module';

@Module({
  imports: [
    UsersModule,
    GuardsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database/database.sqlite',
      synchronize: true,
      autoLoadEntities: true,
      entities: [User, Bmientry],
    }),
    EntitiesModule,
    GoogleRecaptchaModule.forRoot({
      secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
      response: (req) => req.headers.recaptcha,
      score: 0.5,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
      signOptions: { expiresIn: '60s' },
    }),
    CrpytoModule,
    AuthenticationModule,
    BmiModule,
    DecoratorsModule,
    DtosModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthenticationService],
})
export class AppModule {}

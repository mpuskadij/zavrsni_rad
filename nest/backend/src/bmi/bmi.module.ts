import { Module } from '@nestjs/common';
import { BmiController } from './bmi/bmi.controller';
import { GuardsModule } from '../guards/guards.module';
import { JwtGuard } from '../guards/jwt/jwt.guard';
import { AuthenticationService } from '../authentication/authentication-service/authentication-service';
import { AuthenticationModule } from '../authentication/authentication.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { BmiService } from './bmi-service/bmi-service';
import { DecoratorsModule } from '../decorators/decorators.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bmientry } from '../entities/bmientry/bmientry';
import { UsersModule } from '../users/users.module';
import { DtosModule } from '../dtos/dtos.module';
import { BmiEntryDto } from '../dtos/bmi-entry-dto/bmi-entry-dto';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GuardsModule,
    AuthenticationModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    DecoratorsModule,
    UsersModule,
    TypeOrmModule.forFeature([Bmientry]),
    DtosModule,
    AdminModule,
  ],
  exports: [BmiService],
  controllers: [BmiController],
  providers: [JwtGuard, AuthenticationService, BmiService, BmiEntryDto],
})
export class BmiModule {}

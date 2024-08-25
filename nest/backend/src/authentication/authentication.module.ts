import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication-service/authentication-service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload/jwt-payload';

@Module({
  providers: [AuthenticationService, ConfigService, JwtPayload],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}

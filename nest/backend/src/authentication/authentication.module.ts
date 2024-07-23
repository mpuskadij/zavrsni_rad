import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication-service/authentication-service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [AuthenticationService, JwtService, ConfigService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}

import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication-service/authentication-service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload/jwt-payload';

@Module({
  providers: [AuthenticationService, JwtService, ConfigService, JwtPayload],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}

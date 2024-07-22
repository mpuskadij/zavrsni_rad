import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication-service/authentication-service';

@Module({
  providers: [AuthenticationService]
})
export class AuthenticationModule {}

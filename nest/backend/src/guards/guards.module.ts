import { Module } from '@nestjs/common';
import { RegistrationGuard } from './registration-guard/registration-guard';
import { JwtGuard } from './jwt/jwt.guard';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AuthenticationService } from '../authentication/authentication-service/authentication-service';

@Module({
  imports: [AuthenticationModule],
  providers: [RegistrationGuard, JwtGuard],
  exports: [RegistrationGuard, JwtGuard],
})
export class GuardsModule {}

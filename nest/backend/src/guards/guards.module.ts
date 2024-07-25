import { Module } from '@nestjs/common';
import { RegistrationGuard } from './registration-guard/registration-guard';
import { JwtGuard } from './jwt/jwt.guard';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AuthenticationService } from '../authentication/authentication-service/authentication-service';
import { NewBmiEntryGuard } from './new-bmi-entry/new-bmi-entry.guard';
import { BmiService } from '../bmi/bmi-service/bmi-service';

@Module({
  imports: [AuthenticationModule],
  providers: [RegistrationGuard, JwtGuard, NewBmiEntryGuard],
  exports: [RegistrationGuard, JwtGuard, NewBmiEntryGuard],
})
export class GuardsModule {}

import { Module } from '@nestjs/common';
import { RegistrationGuard } from './registration-guard/registration-guard';

@Module({
  providers: [RegistrationGuard],
  exports: [RegistrationGuard],
})
export class GuardsModule {}

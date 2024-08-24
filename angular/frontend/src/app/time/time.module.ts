import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeService } from './time-service/time.service';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { ClockComponent } from './clock/clock.component';

@NgModule({
  declarations: [ClockComponent],
  imports: [CommonModule],
  providers: [TimeService, provideHttpClient(withFetch())],
  exports: [ClockComponent],
})
export class TimeModule {}

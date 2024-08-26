import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TimeService } from '../time-service/time.service';
import { catchError, map, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.scss',
})
export class ClockComponent implements OnInit {
  public time: Date = new Date();
  public note = '';
  @Output() onTimeSet = new EventEmitter<Date>();

  constructor(private timeService: TimeService) {}

  ngOnInit(): void {
    this.timeService
      .getServerTime()
      .pipe(
        map((time) => {
          time.time = new Date(time.time);
          return time;
        })
      )
      .subscribe({
        next: (serverTime) => {
          this.time = serverTime.time;
          this.onTimeSet.emit(this.time);
        },
        error: () => {
          this.note = 'Note: displayed time is not server time';
          this.onTimeSet.emit(this.time);
        },
      });
  }
}

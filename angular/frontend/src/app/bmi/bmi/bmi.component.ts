import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IBmi } from 'src/interfaces/ibmi';
import { BmiService } from '../bmi-service/bmi.service';
import { IBmiGraphData } from 'src/interfaces/ibmi-graph-data';
import { ClockComponent } from 'src/app/time/clock/clock.component';
import { HttpStatusCode } from '@angular/common/http';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bmi',
  templateUrl: './bmi.component.html',
  styleUrl: './bmi.component.scss',
})
export class BmiComponent implements OnInit {
  public canShow: boolean = false;
  public errorMessage: string = '';
  previousBmiEntries: IBmiGraphData[] = [];

  constructor(
    private bmiService: BmiService,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bmiService
      .getPreviousBmiEntries()
      .pipe(
        map((graphData) => {
          graphData.forEach((entry) => {
            entry.dateAdded = new Date(entry.dateAdded);
          });
          return graphData;
        })
      )
      .subscribe({
        next: (previousBmis) => {
          this.previousBmiEntries = previousBmis;
        },
        error: () => {
          this.errorMessage =
            'Something went wrong while getting your previous bmi entries!';
        },
      });
  }

  sendBmi(bmi: IBmi) {
    if (!bmi.height || !bmi.weight) {
      this.errorMessage = 'Weight and/or height cannot be 0!';
      return;
    }
    this.bmiService.sendBmiData(bmi).subscribe({
      next: (body) => {
        this.canShow = false;
        this.errorMessage = 'Your BMI is: ' + body.bmi;
      },
      error: () => {
        this.errorMessage =
          'Something went wrong while sending your height and weight to the server!';
      },
    });
  }

  checkIfFormCanBeShown(serverTime: Date): void {
    setTimeout(() => {
      if (this.previousBmiEntries.length > 0) {
        const latestEntry = this.previousBmiEntries.find((bmi) =>
          Math.max(bmi.dateAdded.getTime())
        );

        const currentDate = new Date(serverTime.getTime());
        currentDate.setHours(0, 0, 0, 0);

        const latestEntryDate = new Date(latestEntry!.dateAdded.getTime());
        latestEntryDate.setHours(0, 0, 0, 0);

        const differenceInMiliseconds = Math.abs(
          currentDate.getTime() - latestEntryDate.getTime()
        );
        const differenceInDays = Math.floor(
          differenceInMiliseconds / (1000 * 60 * 60 * 24)
        );
        if (differenceInDays < 7) {
          this.canShow = false;
          return;
        }
        this.canShow = true;
      }
      this.canShow = true;
    }, 1000);
  }
}

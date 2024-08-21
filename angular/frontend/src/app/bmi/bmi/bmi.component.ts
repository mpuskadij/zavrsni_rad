import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IBmi } from 'src/interfaces/ibmi';
import { BmiService } from '../bmi-service/bmi.service';
import { IBmiGraphData } from 'src/interfaces/ibmi-graph-data';

@Component({
  selector: 'app-bmi',
  templateUrl: './bmi.component.html',
  styleUrl: './bmi.component.scss',
})
export class BmiComponent implements OnInit {
  public errorMessage: string = '';
  previousBmiEntries: IBmiGraphData[] = [];

  constructor(private bmiService: BmiService) {}

  ngOnInit(): void {
    this.bmiService.getPreviousBmiEntries().subscribe((response) => {
      this.previousBmiEntries = response;
    });
  }

  sendBmi(bmi: IBmi) {
    throw new Error('Method not implemented.');
  }

  canShowForm(): boolean {
    return this.previousBmiEntries.length == 0;
  }
}

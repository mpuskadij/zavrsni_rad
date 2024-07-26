export class BmiEntryDto {
  constructor(bmi: number, dateAdded: Date) {
    this.bmi = bmi;
    this.dateAdded = dateAdded;
  }
  bmi: number;
  dateAdded: Date;
}

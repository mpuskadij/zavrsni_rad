import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IBmi } from 'src/interfaces/ibmi';

@Component({
  selector: 'app-new-bmi-entry-form',
  templateUrl: './new-bmi-entry-form.component.html',
  styleUrl: './new-bmi-entry-form.component.scss',
})
export class NewBmiEntryFormComponent {
  public errorMessage = '';
  public minHeight = 1;
  public maxHeight = 3.0;
  public minWeight = 1;
  public maxWeight = 1000;
  @Output() public onSubmit = new EventEmitter<IBmi>();
  public form = this.formBuilder.group({
    height: [
      0,
      [
        Validators.required,
        Validators.min(this.minHeight),
        Validators.max(this.maxHeight),
      ],
    ],
    weight: [
      0,
      [
        Validators.required,
        Validators.min(this.minWeight),
        Validators.max(this.maxWeight),
      ],
    ],
  });

  constructor(private formBuilder: FormBuilder) {}

  public submitForm(): void {
    try {
      const height = this.form.controls.height.value;
      const weight = this.form.controls.weight.value;
      if (height !== null && weight !== null) {
        if (height < this.minHeight || height > this.maxHeight) {
          throw new Error(
            'Height must be in range: ' +
              this.minHeight +
              ' - ' +
              this.maxHeight
          );
        }
        if (weight < this.minWeight || weight > this.maxWeight) {
          throw new Error(
            'Weight must be in range: ' +
              this.minWeight +
              ' - ' +
              this.maxWeight
          );
        }
        const bmi: IBmi = { height: height, weight: weight };
        this.onSubmit.emit(bmi);
      } else {
        throw new Error('Error getting height and weight!');
      }
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}

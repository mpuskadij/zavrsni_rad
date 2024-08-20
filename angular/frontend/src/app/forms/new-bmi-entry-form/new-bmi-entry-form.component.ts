import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IBmi } from 'src/interfaces/ibmi';

@Component({
  selector: 'app-new-bmi-entry-form',
  templateUrl: './new-bmi-entry-form.component.html',
  styleUrl: './new-bmi-entry-form.component.scss',
})
export class NewBmiEntryFormComponent {
  submitForm() {
    try {
      const height = this.form.controls.height.value;
      if (height !== null) {
        if (height < 0) {
          throw new Error('Height cannot be less than 0!');
        }
      }
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
  public errorMessage = '';
  public minHeight = 0;
  public maxHeight = 300;
  public minWeight = 0;
  public maxWeight = 1000;
  public onSubmit = new EventEmitter<IBmi>();
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
}

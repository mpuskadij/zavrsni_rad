import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBmiEntryFormComponent } from './new-bmi-entry-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IBmi } from 'src/interfaces/ibmi';

describe('NewBmiEntryFormComponent', () => {
  let component: NewBmiEntryFormComponent;
  let fixture: ComponentFixture<NewBmiEntryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [NewBmiEntryFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewBmiEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('UI', () => {
    it('should display form element', () => {
      const ui: HTMLElement = fixture.nativeElement;

      const form = ui.querySelector('form');

      expect(form).not.toBeNull();
    });

    it('should display 2 labels', () => {
      const ui: HTMLElement = fixture.nativeElement;

      const labels = ui.querySelectorAll('label');

      expect(labels.length).toBe(2);
    });

    it('should display height label', () => {
      const ui: HTMLElement = fixture.nativeElement;

      const heightLabel = ui.querySelector('label[for="height"]');

      expect(heightLabel).not.toBeNull();
    });

    it('should display height label', () => {
      const ui: HTMLElement = fixture.nativeElement;

      const weightLabel = ui.querySelector('label[for="height"]');

      expect(weightLabel).not.toBeNull();
    });

    it('should display height input', () => {
      const ui: HTMLElement = fixture.nativeElement;

      const heightInput = ui.querySelector('input[id="height"]');

      expect(heightInput).not.toBeNull();
    });

    it('should display weight input', () => {
      const ui: HTMLElement = fixture.nativeElement;

      const heweightInput = ui.querySelector('input[id="weight"]');

      expect(heweightInput).not.toBeNull();
    });

    it('should display a button', () => {
      const ui: HTMLElement = fixture.nativeElement;

      const button = ui.querySelector('button[id="submitBmi"]');

      expect(button).not.toBeNull();
    });

    it('should display a disabled button', () => {
      const ui: HTMLElement = fixture.nativeElement;

      const button = ui.querySelector('button');

      expect(button).not.toBeNull();
      expect(button!.disabled).toBeTrue();
    });

    it('should display a disabled button if height is set, but not weight', () => {
      const ui: HTMLElement = fixture.nativeElement;
      component.form.controls.height.setValue(component.minHeight);

      fixture.detectChanges();

      const button = ui.querySelector('button');
      expect(button!.disabled).toBeTrue();
    });

    it('should display a disabled button if weight is set, but not height', () => {
      const ui: HTMLElement = fixture.nativeElement;
      component.form.controls.weight.setValue(component.minWeight);

      fixture.detectChanges();

      const button = ui.querySelector('button');
      expect(button!.disabled).toBeTrue();
    });

    it('should display a enabled button if weight and height in range', () => {
      const ui: HTMLElement = fixture.nativeElement;
      component.form.controls.weight.setValue(component.minWeight);
      component.form.controls.height.setValue(component.minHeight);

      fixture.detectChanges();

      const button = ui.querySelector('button');
      expect(button!.disabled).toBeFalse();
    });
  });

  describe('submitForm', () => {
    it('should display error if height is null', () => {
      component.form.controls.height.setValue(null);
      component.submitForm();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should display error if weight is null', () => {
      component.form.controls.weight.setValue(null);
      component.submitForm();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should display error if height is less that min height', () => {
      component.form.controls.height.setValue(component.minHeight - 1);
      component.submitForm();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should display error if height is greater that max height', () => {
      component.form.controls.height.setValue(component.maxHeight + 1);
      component.submitForm();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should display error if weight is less than min weight', () => {
      component.form.controls.weight.setValue(component.minWeight - 1);
      component.submitForm();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should display error if weight is greater that max weight', () => {
      component.form.controls.weight.setValue(component.maxWeight + 1);
      component.submitForm();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should emit event when height and weight within range', () => {
      component.form.controls.height.setValue(component.maxHeight);
      component.form.controls.weight.setValue(component.maxWeight);
      const bmi: IBmi = {
        height: component.maxHeight,
        weight: component.maxWeight,
      };
      spyOn(component.onSubmit, 'emit');

      component.submitForm();

      expect(component.errorMessage).toBeFalsy();
      expect(component.onSubmit.emit).toHaveBeenCalledWith(bmi);
    });
  });
});

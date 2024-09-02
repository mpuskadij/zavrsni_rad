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

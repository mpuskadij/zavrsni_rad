import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBmiEntryFormComponent } from './new-bmi-entry-form.component';
import { ReactiveFormsModule } from '@angular/forms';

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
    it('should display error if height is negative', () => {
      component.form.controls.height.setValue(-1);
      component.submitForm();

      expect(component.errorMessage).toBeTruthy();
    });
  });
});

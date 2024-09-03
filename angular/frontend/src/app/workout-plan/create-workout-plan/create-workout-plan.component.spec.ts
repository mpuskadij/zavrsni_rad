import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkoutPlanComponent } from './create-workout-plan.component';
import { TimeModule } from 'src/app/time/time.module';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkoutPlanService } from '../workout-plan-service/workout-plan.service';
import { of, throwError } from 'rxjs';

describe('CreateWorkoutPlanComponent', () => {
  let component: CreateWorkoutPlanComponent;
  let fixture: ComponentFixture<CreateWorkoutPlanComponent>;
  let workoutPlanService: WorkoutPlanService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateWorkoutPlanComponent],
      imports: [
        TimeModule,
        NavigationComponent,
        HttpClientTestingModule,
        AppRoutingModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateWorkoutPlanComponent);
    component = fixture.componentInstance;
    workoutPlanService = TestBed.inject(WorkoutPlanService);
    fixture.detectChanges();
  });

  describe('cancel', () => {
    it('should navigate', () => {
      expect(component.cancel()).toBe(void 0);
    });
  });

  describe('submit', () => {
    it('should set error message if form is invalid', () => {
      component.submit();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if form is valid, but service returned error', () => {
      spyOn(workoutPlanService, 'createWorkoutPlan').and.returnValue(
        throwError(() => new Error('Backend error'))
      );
      component.form.controls.title.setValue('abc');
      component.submit();

      expect(workoutPlanService.createWorkoutPlan).toHaveBeenCalled();
      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if form is valid, but service returned error', () => {
      spyOn(workoutPlanService, 'createWorkoutPlan').and.returnValue(of());
      component.form.controls.title.setValue('abc');
      component.submit();

      expect(workoutPlanService.createWorkoutPlan).toHaveBeenCalled();
      expect(component.errorMessage).toBeFalsy();
    });
  });
});

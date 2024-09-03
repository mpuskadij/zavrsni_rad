import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutPlansComponent } from './workout-plans.component';
import { WorkoutPlanService } from '../workout-plan-service/workout-plan.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { of, throwError } from 'rxjs';
import { IWorkoutPlan } from 'src/interfaces/iworkout-plan';
import { TimeModule } from 'src/app/time/time.module';

describe('WorkoutPlansComponent', () => {
  let component: WorkoutPlansComponent;
  let fixture: ComponentFixture<WorkoutPlansComponent>;
  let workoutPlanService: WorkoutPlanService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NavigationComponent,
        AppRoutingModule,
        TimeModule,
      ],
      declarations: [WorkoutPlansComponent],
      providers: [WorkoutPlanService],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutPlansComponent);
    workoutPlanService = TestBed.inject(WorkoutPlanService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should use workoutplanservice to fetch data from backend', () => {
      spyOn(workoutPlanService, 'getAllWorkoutPlans').and.returnValue(of());

      component.ngOnInit();

      expect(workoutPlanService.getAllWorkoutPlans).toHaveBeenCalled();
    });

    it('should set workoutPlans property if body contains workout plans', () => {
      const workoutPlan: IWorkoutPlan = {
        dateAdded: new Date(),
        id: 1,
        title: 'asdasd',
      };
      const responseBody = [workoutPlan];
      spyOn(workoutPlanService, 'getAllWorkoutPlans').and.returnValue(
        of(responseBody)
      );

      component.ngOnInit();

      expect(component.workoutPlans.length).toBe(1);
    });

    it('should display error message if there was an error fetching data', () => {
      spyOn(workoutPlanService, 'getAllWorkoutPlans').and.returnValue(
        throwError(() => new Error('Backend error!'))
      );

      component.ngOnInit();

      expect(component.errorMessage).toBeTruthy();
      expect(component.workoutPlans.length).toBe(0);
    });
  });

  describe('getDetailsOfWorkoutPlan', () => {
    it('should set error message if id is NaN', () => {
      component.getDetailsOfWorkoutPlan(NaN);

      expect(component.errorMessage).toBeTruthy();
    });

    it('should navigate if id is a number', () => {
      component.getDetailsOfWorkoutPlan(1);

      expect(component.errorMessage).toBeFalsy();
    });
  });

  describe('navigateToFrom', () => {
    it('should navigate when called', () => {
      component.navigateToForm();

      expect(component.errorMessage).toBeFalsy();
    });
  });
});

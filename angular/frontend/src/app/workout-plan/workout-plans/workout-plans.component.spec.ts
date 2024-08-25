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

  describe('UI', () => {
    it('should have navigation', () => {
      const ui: HTMLElement = fixture.nativeElement;
      const nav = ui.querySelector('nav');
      expect(nav).not.toBeNull();
    });

    it('should have a clock', () => {
      const ui: HTMLElement = fixture.nativeElement;
      const clock = ui.querySelector('#clock');
      expect(clock).not.toBeNull();
    });

    it('should not have a table if no workout plans', () => {
      component.errorMessage = 'Error!';

      component.ngOnInit();

      fixture.detectChanges();

      const ui: HTMLElement = fixture.nativeElement;
      const table = ui.querySelector('table');

      expect(table).toBeNull();
    });

    it('should have a table if there are workout plans', () => {
      component.workoutPlans = [
        { id: 1, dateAdded: new Date(), title: 'asdasdsa' },
      ];

      component.ngOnInit();

      fixture.detectChanges();

      const ui: HTMLElement = fixture.nativeElement;
      const table = ui.querySelector('table');

      expect(table).not.toBeNull();
    });

    it('should have a table head if there are workout plans', () => {
      component.workoutPlans = [
        { id: 1, dateAdded: new Date(), title: 'asdasdsa' },
      ];

      component.ngOnInit();

      fixture.detectChanges();

      const ui: HTMLElement = fixture.nativeElement;
      const thead = ui.querySelector('thead');

      expect(thead).not.toBeNull();
    });

    it('should have 2 headers', () => {
      component.workoutPlans = [
        { id: 1, dateAdded: new Date(), title: 'asdasdsa' },
      ];

      component.ngOnInit();

      fixture.detectChanges();

      const ui: HTMLElement = fixture.nativeElement;
      const th = ui.querySelectorAll('th');

      expect(th).not.toBeNull();
      expect(th.length).toBe(2);
    });

    it('should have tbody tag', () => {
      component.workoutPlans = [
        { id: 1, dateAdded: new Date(), title: 'asdasdsa' },
      ];

      component.ngOnInit();

      fixture.detectChanges();

      const ui: HTMLElement = fixture.nativeElement;
      const tbody = ui.querySelector('tbody');

      expect(tbody).not.toBeNull();
    });

    it('should 2 rows (header + data) if there is only 1 workout plan', () => {
      component.workoutPlans = [
        { id: 1, dateAdded: new Date(), title: 'asdasdsa' },
      ];

      component.ngOnInit();

      fixture.detectChanges();

      const ui: HTMLElement = fixture.nativeElement;
      const tr = ui.querySelectorAll('tr');

      expect(tr).not.toBeNull();
      expect(tr.length).toBe(2);
    });

    it('should have a button for creating a new workout plan', () => {
      const ui: HTMLElement = fixture.nativeElement;
      const button = ui.querySelector('button');

      expect(button).not.toBeNull();
    });
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
});

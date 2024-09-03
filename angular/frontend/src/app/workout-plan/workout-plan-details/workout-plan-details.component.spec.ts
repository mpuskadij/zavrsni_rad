import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutPlanDetailsComponent } from './workout-plan-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { TimeModule } from 'src/app/time/time.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { WorkoutPlanService } from '../workout-plan-service/workout-plan.service';
import { of, throwError } from 'rxjs';
import { IWorkoutPlanDetails } from 'src/interfaces/iworkout-plan-details';

describe('WorkoutPlanDetailsComponent', () => {
  let component: WorkoutPlanDetailsComponent;
  let fixture: ComponentFixture<WorkoutPlanDetailsComponent>;
  let service: WorkoutPlanService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkoutPlanDetailsComponent],
      imports: [
        HttpClientTestingModule,
        NavigationComponent,
        TimeModule,
        AppRoutingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutPlanDetailsComponent);
    service = TestBed.inject(WorkoutPlanService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set error message if id is empty', () => {
      component.id = '';

      component.ngOnInit();

      expect(component.note).toBeTruthy();
    });

    it('should set error message if service returns error observable', () => {
      spyOn(service, 'getDetails').and.returnValue(
        throwError(() => new Error('Backend error!'))
      );
      component.id = '2';

      component.ngOnInit();

      expect(component.note).toBeTruthy();
    });

    it('should set error message if service return empty array', () => {
      const data: IWorkoutPlanDetails = {
        exercises: [],
        dateAdded: new Date(),
        id: 2,
        title: 'sdasda',
      };
      spyOn(service, 'getDetails').and.returnValue(of(data));
      component.id = '2';

      component.ngOnInit();

      expect(component.note).toBeTruthy();
    });

    it('should set property if array is not empty', () => {
      const data: IWorkoutPlanDetails = {
        exercises: [
          {
            category: 'asdasd',
            description: 'asdadsa',
            equipment: 'asdasd',
            name: 'asdas',
          },
        ],
        dateAdded: new Date(),
        id: 2,
        title: 'sdasda',
      };
      spyOn(service, 'getDetails').and.returnValue(of(data));
      component.id = '2';

      component.ngOnInit();

      expect(component.workoutPlanDetails).toEqual(data);
    });
  });

  describe('deleteExercise', () => {
    it('should set note if index is NaN', () => {
      component.deleteExercise(
        {
          category: 'asdasda',
          description: 'asdads',
          equipment: '123123',
          name: 'asdasdas',
        },
        NaN
      );

      expect(component.note).toBeTruthy();
    });

    it('should set note if exercise name is empty', () => {
      component.deleteExercise(
        {
          category: 'asdasda',
          description: 'asdads',
          equipment: '123123',
          name: '',
        },
        2
      );

      expect(component.note).toBeTruthy();
    });

    it('should set note if property details is undefined', () => {
      component.workoutPlanDetails = undefined;
      component.deleteExercise(
        {
          category: 'asdasda',
          description: 'asdads',
          equipment: '123123',
          name: 'dasasd',
        },
        2
      );

      expect(component.note).toBeTruthy();
    });

    it('should set call workoutPlanService if parameters are valid', () => {
      component.workoutPlanDetails = {
        exercises: [
          {
            category: 'sadasd',
            description: 'asdasd',
            equipment: 'asdasd',
            name: 'asdasd',
          },
        ],
        dateAdded: new Date(),
        id: 2,
        title: 'sdasd',
      };
      spyOn(service, 'deleteExercise').and.returnValue(
        throwError(() => new Error('Backedn error!'))
      );
      component.deleteExercise(
        {
          category: 'asdasda',
          description: 'asdads',
          equipment: '123123',
          name: 'dasasd',
        },
        2
      );
      expect(service.deleteExercise).toHaveBeenCalled();
      expect(component.note).toBeTruthy();
    });

    it('should set call workoutPlanService if parameters are valid', () => {
      component.workoutPlanDetails = {
        exercises: [
          {
            category: 'sadasd',
            description: 'asdasd',
            equipment: 'asdasd',
            name: 'asdasd',
          },
        ],
        dateAdded: new Date(),
        id: 2,
        title: 'sdasd',
      };
      spyOn(service, 'deleteExercise').and.returnValue(of());
      component.deleteExercise(
        {
          category: 'asdasda',
          description: 'asdads',
          equipment: '123123',
          name: 'dasasd',
        },
        2
      );
      expect(service.deleteExercise).toHaveBeenCalled();
      expect(component.note).toBeTruthy();
    });
  });

  describe('navigateToSearch', () => {
    it('should set note if workout plan details are falsy', () => {
      component.workoutPlanDetails = undefined;

      component.navigateToSearch();

      expect(component.note).toBeTruthy();
    });
  });

  describe('deleteWorkout', () => {
    it('should set note if workout plan id is NaN', () => {
      component.deleteWorkout(NaN);

      expect(component.note).toBeTruthy();
    });

    it('should set note if observable service returned error', () => {
      spyOn(service, 'deleteWorkoutPlan').and.returnValue(
        throwError(() => new Error('Backend error!'))
      );
      component.deleteWorkout(1);

      expect(service.deleteWorkoutPlan).toHaveBeenCalled();
      expect(component.note).toBeTruthy();
    });

    it('should navigate to url if service did not return error', () => {
      spyOn(service, 'deleteWorkoutPlan').and.returnValue(of());
      component.deleteWorkout(1);

      expect(service.deleteWorkoutPlan).toHaveBeenCalled();
    });
  });
});

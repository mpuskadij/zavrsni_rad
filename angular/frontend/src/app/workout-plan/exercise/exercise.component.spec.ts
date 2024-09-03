import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseComponent } from './exercise.component';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { TimeModule } from 'src/app/time/time.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ExerciseService } from '../exercise-service/exercise.service';
import { of, throwError } from 'rxjs';
import { IExercise } from 'src/interfaces/iexercise';
import { WorkoutPlanService } from '../workout-plan-service/workout-plan.service';

describe('ExerciseComponent', () => {
  let component: ExerciseComponent;
  let fixture: ComponentFixture<ExerciseComponent>;
  let exerciseService: ExerciseService;
  let workoutPlanService: WorkoutPlanService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExerciseComponent],
      imports: [
        NavigationComponent,
        TimeModule,
        AppRoutingModule,
        HttpClientTestingModule,
      ],
      providers: [ExerciseService],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseComponent);
    exerciseService = TestBed.inject(ExerciseService);
    workoutPlanService = TestBed.inject(WorkoutPlanService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('search', () => {
    it('should set note if category doesnt not in select', () => {
      component.search(NaN, 'abc', 'a', 'b');

      expect(component.note).toBeTruthy();
    });

    it('should set note if category doesnt not exist in select options', () => {
      component.search(1, 'as', 'NONEXISTANT', 'Bench');

      expect(component.note).toBeTruthy();
    });

    it('should set note if equipment doesnt not exist in select options', () => {
      component.search(1, 'asdsad', 'Abs', 'NONEXISTANT');

      expect(component.note).toBeTruthy();
    });

    it('should set note if only page passed', () => {
      component.search(1, '', '', '');

      expect(component.note).toBeTruthy();
    });

    it('should set note and exercises array service returned error', () => {
      spyOn(exerciseService, 'search').and.returnValue(
        throwError(() => new Error('No exercises!'))
      );
      component.search(1, 'Abs', 'Abs', 'Bench');

      expect(exerciseService.search).toHaveBeenCalled();
      expect(component.exercises.length).toBe(0);
      expect(component.fetched).toBeFalse();
      expect(component.note).toBeTruthy();
    });

    it('should set note if only page passed', () => {
      const data: IExercise[] = [
        {
          category: 1,
          description: 'asdasd',
          equipment: [2],
          name: 'Dsadasdads',
        },
      ];
      spyOn(exerciseService, 'search').and.returnValue(of(data));
      component.search(1, 'Abs', 'Abs', 'Bench');

      expect(exerciseService.search).toHaveBeenCalled();
      expect(component.exercises).toEqual(data);
      expect(component.fetched).toBeTrue();
      expect(component.note).toBeFalsy();
    });
  });

  describe('add', () => {
    it('should throw error if id is empty', () => {
      component.id = '';

      component.add('');

      expect(component.note).toBeTruthy();
    });

    it('should throw error if exercise name is empty', () => {
      component.id = '2';

      component.add('');

      expect(component.note).toBeTruthy();
    });

    it('should set note if service returned error', () => {
      spyOn(workoutPlanService, 'addExercise').and.returnValue(
        throwError(() => new Error('Backend error!'))
      );
      component.id = '2';

      component.add('asda');
      expect(workoutPlanService.addExercise).toHaveBeenCalled();
      expect(component.note).toBeTruthy();
    });

    it('should set note if service returned error', () => {
      spyOn(workoutPlanService, 'addExercise').and.returnValue(of());
      component.id = '2';

      component.add('asda');
      expect(workoutPlanService.addExercise).toHaveBeenCalled();
      expect(component.note).toBeFalsy();
    });
  });
});

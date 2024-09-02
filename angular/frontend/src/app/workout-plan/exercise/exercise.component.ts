import { Component, Input, OnInit } from '@angular/core';
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { IExercise } from 'src/interfaces/iexercise';
import { ExerciseService } from '../exercise-service/exercise.service';
import { WorkoutPlanService } from '../workout-plan-service/workout-plan.service';
import { IAddExercise } from 'src/interfaces/iadd-exercise';
import { Router } from '@angular/router';
import { HttpStatusCode } from '@angular/common/http';
import { ISearchExercise } from 'src/interfaces/isearch-exercise';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.scss',
})
export class ExerciseComponent {
  @Input({ required: true }) id = '';
  public exercises: IExercise[] = [];
  page: number = 1;
  fetched: boolean = false;

  absId = 'Abs';
  armsId = 'Arms';
  backId = 'Back';
  calvesId = 'Calves';
  cardioId = 'Cardio';
  chestId = 'Chest';
  legsId = 'Legs';
  shouldersId = 'Shoulders';
  noCategoryId = '';

  barbellId = 'Barbell';
  szBarId = 'SZ-Bar';
  dumbbellId = 'Dumbbell';
  gymMatID = 'Gym mat';
  swissBallId = 'Swiss Ball';
  pullupBarId = 'Pull-up bar';
  bodyweightId = 'none (bodyweight exercise)';
  benchId = 'Bench';
  inclineBenchId = 'Incline bench';
  kettlebellId = 'Kettlebell';

  private equipments = [
    this.barbellId,
    this.szBarId,
    this.dumbbellId,
    this.gymMatID,
    this.swissBallId,
    this.pullupBarId,
    this.bodyweightId,
    this.benchId,
    this.inclineBenchId,
    this.kettlebellId,
    this.noCategoryId,
  ];

  private categories = [
    this.absId,
    this.armsId,
    this.backId,
    this.calvesId,
    this.cardioId,
    this.chestId,
    this.legsId,
    this.shouldersId,
    this.noCategoryId,
  ];

  note = '';

  constructor(
    private exerciseService: ExerciseService,
    private workoutPlanService: WorkoutPlanService,
    private router: Router
  ) {}
  search(
    page: number,
    searchTerm: string,
    category: string,
    equipment: string
  ) {
    try {
      this.fetched = false;
      if (this.categories.includes(category) == false) {
        throw new Error('Category value is not valid!');
      }
      if (this.equipments.includes(equipment) == false) {
        throw new Error('Equipment value is not valid!');
      }
      if (!searchTerm && !category && !equipment) {
        throw new Error('Please provide search term, category or equipment!');
      }
      const query: ISearchExercise = {
        category: category,
        equipment: equipment,
        searchTerm: searchTerm,
        page: page,
      };
      this.exerciseService.search(query).subscribe({
        next: (foundExercises) => {
          this.exercises = foundExercises;
          this.fetched = true;
          this.note = '';
        },
        error: () => {
          this.note = 'No exercises found!';
          this.exercises = [];
          this.fetched = false;
        },
      });
    } catch (error: any) {
      this.note = error.message;
    }
  }

  add(exerciseName: string) {
    try {
      if (+this.id && exerciseName) {
        const body: IAddExercise = { name: exerciseName };
        this.workoutPlanService.addExercise(+this.id, body).subscribe({
          next: (response) => {
            if (response.status == HttpStatusCode.Created) {
              this.router.navigate([`/workout-plans/${+this.id}`], {
                replaceUrl: true,
              });
            }
          },
          error: () => {
            this.note =
              'Something went wrong while trying to add exercise to your workout plan!';
          },
        });
      } else {
        throw new Error('Invalid workout plan id or exercise name!');
      }
    } catch (error: any) {
      this.note = error.message;
    }
  }
}

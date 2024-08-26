import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkoutPlanComponent } from './create-workout-plan.component';
import { TimeModule } from 'src/app/time/time.module';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

describe('CreateWorkoutPlanComponent', () => {
  let component: CreateWorkoutPlanComponent;
  let fixture: ComponentFixture<CreateWorkoutPlanComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

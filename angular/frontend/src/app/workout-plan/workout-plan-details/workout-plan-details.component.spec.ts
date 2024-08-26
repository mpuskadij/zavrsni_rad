import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutPlanDetailsComponent } from './workout-plan-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { TimeModule } from 'src/app/time/time.module';
import { AppRoutingModule } from 'src/app/app-routing.module';

describe('WorkoutPlanDetailsComponent', () => {
  let component: WorkoutPlanDetailsComponent;
  let fixture: ComponentFixture<WorkoutPlanDetailsComponent>;

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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

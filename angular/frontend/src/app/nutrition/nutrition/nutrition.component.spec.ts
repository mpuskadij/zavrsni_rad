import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionComponent } from './nutrition.component';
import { TimeModule } from 'src/app/time/time.module';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NutritionService } from '../nutrition-service/nutrition.service';

describe('NutritionComponent', () => {
  let component: NutritionComponent;
  let fixture: ComponentFixture<NutritionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NutritionComponent],
      imports: [
        TimeModule,
        NavigationComponent,
        AppRoutingModule,
        HttpClientTestingModule,
      ],
      providers: [NutritionService],
    }).compileComponents();

    fixture = TestBed.createComponent(NutritionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

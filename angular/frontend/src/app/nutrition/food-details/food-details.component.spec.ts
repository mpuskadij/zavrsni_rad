import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodDetailsComponent } from './food-details.component';
import { NutritionService } from '../nutrition-service/nutrition.service';
import { FoodService } from '../food-service/food.service';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FoodDetailsComponent', () => {
  let component: FoodDetailsComponent;
  let fixture: ComponentFixture<FoodDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoodDetailsComponent],
      imports: [NavigationComponent, AppRoutingModule, HttpClientTestingModule],
      providers: [NutritionService, FoodService],
    }).compileComponents();

    fixture = TestBed.createComponent(FoodDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

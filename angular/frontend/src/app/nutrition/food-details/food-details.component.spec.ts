import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodDetailsComponent } from './food-details.component';
import { NutritionService } from '../nutrition-service/nutrition.service';
import { FoodService } from '../food-service/food.service';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { IFoodDetails } from 'src/interfaces/ifood-details';

describe('FoodDetailsComponent', () => {
  let component: FoodDetailsComponent;
  let fixture: ComponentFixture<FoodDetailsComponent>;
  let foodService: FoodService;
  let nutritionService: NutritionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoodDetailsComponent],
      imports: [NavigationComponent, AppRoutingModule, HttpClientTestingModule],
      providers: [NutritionService, FoodService],
    }).compileComponents();

    fixture = TestBed.createComponent(FoodDetailsComponent);
    component = fixture.componentInstance;
    foodService = TestBed.inject(FoodService);
    nutritionService = TestBed.inject(NutritionService);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set invalid type to true if type is invalid', () => {
      component.type = 'invalid';
      fixture.detectChanges();

      component.ngOnInit();

      expect(component.invalidType).toBeTrue();
    });

    it('should set note if server returned error', () => {
      spyOn(foodService, 'getDetails').and.returnValue(
        throwError(() => new Error('Backend error'))
      );
      component.type = 'common';
      component.id = 'hamburger';
      fixture.detectChanges();

      component.ngOnInit();
      expect(foodService.getDetails).toHaveBeenCalled();
      expect(component.note).toBeTruthy();
    });

    it('should set property if server returned details', () => {
      const details: IFoodDetails = {
        brand_name: 'asd',
        food_name: '',
        metadata: { is_raw_food: false },
        nf_calories: 2,
        nf_cholesterol: 2,
        nf_dietary_fiber: 2,
        nf_p: 2,
        nf_potassium: 2,
        nf_protein: 2,
        nf_saturated_fat: 2,
        nf_sodium: 2,
        nf_sugars: 2,
        nf_total_carbohydrate: 2,
        nf_total_fat: 2,
        serving_unit: 'ng',
        serving_weight_grams: 2,
        nf_ingredient_statement: '',
        nf_metric_qty: 2,
        nf_metric_uom: '2',
        nix_item_id: 'asda',
        tag_id: 's',
      };
      spyOn(foodService, 'getDetails').and.returnValue(of(details));
      component.type = 'common';
      component.id = 'hamburger';
      fixture.detectChanges();

      component.ngOnInit();
      expect(foodService.getDetails).toHaveBeenCalled();
      expect(component.details).toEqual(details);
    });
  });

  describe('addFood', () => {
    it('should set note if food type is invalid', () => {
      component.type = 'invalid';

      component.addFood();

      expect(component.note).toBeTruthy();
    });

    it('should set note if server returned error', () => {
      spyOn(nutritionService, 'addToNutrition').and.returnValue(
        throwError(() => new Error('Backend error'))
      );
      component.type = 'branded';
      component.id = 'asdasd';
      fixture.detectChanges();

      component.addFood();
      expect(nutritionService.addToNutrition).toHaveBeenCalled();
      expect(component.note).toBeTruthy();
    });

    it('should navigate if server returned 201', () => {
      spyOn(nutritionService, 'addToNutrition').and.returnValue(of());
      component.type = 'branded';
      component.id = 'asdasd';
      fixture.detectChanges();

      expect(component.addFood()).toBe(void 0);
      expect(nutritionService.addToNutrition).toHaveBeenCalled();
    });
  });
});

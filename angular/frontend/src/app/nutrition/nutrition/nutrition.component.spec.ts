import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionComponent } from './nutrition.component';
import { TimeModule } from 'src/app/time/time.module';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NutritionService } from '../nutrition-service/nutrition.service';
import { of, throwError } from 'rxjs';
import { INutritionFood } from 'src/interfaces/inutrition-food';

describe('NutritionComponent', () => {
  let component: NutritionComponent;
  let fixture: ComponentFixture<NutritionComponent>;
  let nutritionService: NutritionService;

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
    nutritionService = TestBed.inject(NutritionService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set note if server returned error', () => {
      spyOn(nutritionService, 'getNutrition').and.returnValue(
        throwError(() => new Error('Backend error!'))
      );
      component.ngOnInit();

      expect(component.note).toBeTruthy();
    });

    it('should set property if server returned foods', () => {
      const body: INutritionFood[] = [
        { id: 1, name: 'hamburger', quantity: 1 },
      ];
      spyOn(nutritionService, 'getNutrition').and.returnValue(of(body));
      component.ngOnInit();

      expect(component.foods).toEqual(body);
    });

    it('should set note if server returned foods', () => {
      spyOn(nutritionService, 'getNutrition').and.returnValue(of());
      component.ngOnInit();

      expect(component.foods.length).toEqual(0);
    });
  });

  describe('deleteFood', () => {
    it('should set note if food id is NaN', () => {
      component.deleteFood(NaN, 1);

      expect(component.note).toBeTruthy();
    });

    it('should set note if index is NaN', () => {
      component.deleteFood(1, NaN);

      expect(component.note).toBeTruthy();
    });

    it('should set note if server returned error', () => {
      spyOn(nutritionService, 'deleteFood').and.returnValue(
        throwError(() => new Error('Backend error'))
      );
      component.deleteFood(1, 1);
      expect(nutritionService.deleteFood).toHaveBeenCalled();
      expect(component.note).toBeTruthy();
    });

    it('should set splice foods array if service finished', () => {
      spyOn(nutritionService, 'deleteFood').and.returnValue(of());
      component.foods = [{ id: 1, name: 'asdad', quantity: 2 }];
      component.deleteFood(
        1,
        component.foods.findIndex((fd) => fd.id == 1)
      );

      expect(nutritionService.deleteFood).toHaveBeenCalled();
    });
  });

  describe('updateQuantity', () => {
    it('should set note if no changed foods', () => {
      component.updateQuantity();

      expect(component.note).toBeTruthy();
    });

    it('should set note if server returned errror', () => {
      component.changedFoods = [{ id: 1, name: 'asdas', quantity: 2 }];
      spyOn(nutritionService, 'updateQuantity').and.returnValue(
        throwError(() => new Error('Backend error'))
      );
      component.updateQuantity();

      expect(nutritionService.updateQuantity).toHaveBeenCalled();
      expect(component.note).toBeTruthy();
    });

    it('should reset changed foods if server returned 204 resposne code', () => {
      component.changedFoods = [{ id: 1, name: 'asdas', quantity: 2 }];
      spyOn(nutritionService, 'updateQuantity').and.returnValue(of());
      component.updateQuantity();

      expect(nutritionService.updateQuantity).toHaveBeenCalled();
      expect(component.changedFoods.length).toBe(1);
    });
  });

  describe('navigateToSearch', () => {
    it('should navigate when called', () => {
      expect(component.navigateToFoodSearch()).toBe(void 0);
    });
  });

  describe('changeQuantity', () => {
    it('should set note if quantity is 0', () => {
      const food: INutritionFood = { id: 1, name: 'sadasd', quantity: 0 };
      component.changeQuantity(food);

      expect(component.note).toBeTruthy();
    });

    it('should push food if food is not in array already', () => {
      const food: INutritionFood = { id: 1, name: 'sadasd', quantity: 1 };
      component.changeQuantity(food);

      expect(component.changedFoods.length).toBe(1);
    });

    it('should NOT push food if food is in array already', () => {
      const food: INutritionFood = { id: 1, name: 'sadasd', quantity: 1 };
      const foodUpdated: INutritionFood = {
        id: 1,
        name: 'sadasd',
        quantity: 2,
      };
      component.changeQuantity(food);
      component.changeQuantity(foodUpdated);

      expect(component.changedFoods.length).toBe(1);
    });
  });
});

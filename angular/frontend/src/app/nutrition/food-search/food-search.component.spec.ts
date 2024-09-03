import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodSearchComponent } from './food-search.component';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { TimeModule } from 'src/app/time/time.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FoodService } from '../food-service/food.service';
import { of, throwError } from 'rxjs';
import { IFoodSearchResponseBody } from 'src/interfaces/ifood-search-response-body';
import { ICommonFood } from 'src/interfaces/icommon-food';
import { IBrandedFood } from 'src/interfaces/ibranded-food';

describe('FoodSearchComponent', () => {
  let component: FoodSearchComponent;
  let fixture: ComponentFixture<FoodSearchComponent>;
  let foodService: FoodService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoodSearchComponent],
      imports: [
        NavigationComponent,
        AppRoutingModule,
        TimeModule,
        HttpClientTestingModule,
      ],
      providers: [FoodService],
    }).compileComponents();

    fixture = TestBed.createComponent(FoodSearchComponent);
    component = fixture.componentInstance;
    foodService = TestBed.inject(FoodService);
    fixture.detectChanges();
  });

  describe('search', () => {
    it('should set note if search term is empty', () => {
      component.search('');

      expect(component.note).toBeTruthy();
    });

    it('should set note if search term is empty', () => {
      spyOn(foodService, 'searchFood').and.returnValue(
        throwError(() => new Error('Backend error!'))
      );
      component.search('hfdsj');

      expect(foodService.searchFood).toHaveBeenCalled();
      expect(component.note).toBeTruthy();
    });

    it('should set set property if service returned data', () => {
      const body: IFoodSearchResponseBody = { branded: [], common: [] };
      spyOn(foodService, 'searchFood').and.returnValue(of(body));
      component.search('hfdsj');

      expect(foodService.searchFood).toHaveBeenCalled();
      expect(component.foods).toBeDefined();
      expect(component.foods).toEqual(body);
      expect(component.note).toBeFalsy();
    });
  });

  describe('navigateToDetailsOfCommonFood', () => {
    it('should execute when called', () => {
      const common: ICommonFood = {
        food_name: 'asda',
        photo: { thumb: '' },
        serving_qty: 0,
        serving_unit: 'mg',
        tag_id: '',
        tag_name: '',
      };
      expect(component.navigateToDetailsOfCommonFood(common)).toBe(void 0);
    });
  });
  describe('navigateToDetailsOfBrandedFood', () => {
    it('should execute when called', () => {
      const branded: IBrandedFood = {
        food_name: 'asda',
        photo: { thumb: '' },
        brand_name: 'mc',
        brand_name_item_name: 'mc burger',
        nf_calories: 2,
        nix_item_id: 'sadas',
        serving_qty: 0,
        serving_unit: 'mg',
      };
      expect(component.navigateToDetailsOfBrandedFood(branded)).toBe(void 0);
    });
  });
});

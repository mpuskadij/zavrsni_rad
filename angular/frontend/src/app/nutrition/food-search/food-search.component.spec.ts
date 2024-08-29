import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodSearchComponent } from './food-search.component';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { TimeModule } from 'src/app/time/time.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FoodService } from '../food-service/food.service';

describe('FoodSearchComponent', () => {
  let component: FoodSearchComponent;
  let fixture: ComponentFixture<FoodSearchComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

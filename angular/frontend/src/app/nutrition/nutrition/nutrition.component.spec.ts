import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionComponent } from './nutrition.component';
import { TimeModule } from 'src/app/time/time.module';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

describe('NutritionComponent', () => {
  let component: NutritionComponent;
  let fixture: ComponentFixture<NutritionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NutritionComponent],
      imports: [TimeModule, NavigationComponent, AppRoutingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NutritionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

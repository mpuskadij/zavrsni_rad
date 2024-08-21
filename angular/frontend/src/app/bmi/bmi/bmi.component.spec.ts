import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmiComponent } from './bmi.component';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { GraphsModule } from 'src/app/graphs/graphs.module';
import { FormsModule } from 'src/app/forms/forms.module';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BmiService } from '../bmi-service/bmi.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('BmiComponent', () => {
  let component: BmiComponent;
  let fixture: ComponentFixture<BmiComponent>;
  let httpTestingController: HttpTestingController;
  let bmiService: BmiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BmiComponent],
      imports: [
        NavigationComponent,
        GraphsModule,
        FormsModule,
        AppRoutingModule,
        HttpClientTestingModule,
      ],
      providers: [BmiService],
    }).compileComponents();

    fixture = TestBed.createComponent(BmiComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    bmiService = TestBed.inject(BmiService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should use bmi service to GET previous bmi entries', () => {
      spyOn(bmiService, 'getPreviousBmiEntries').and.returnValue(of());

      component.ngOnInit();

      expect(bmiService.getPreviousBmiEntries).toHaveBeenCalled();
    });

    it('should set previous bmi entries if there are any', () => {
      spyOn(bmiService, 'getPreviousBmiEntries').and.returnValue(of());

      component.ngOnInit();

      expect(bmiService.getPreviousBmiEntries).toHaveBeenCalled();
    });
  });

  describe('canShowForm', () => {
    it('should return true if no previous bmi entries!', () => {
      component.previousBmiEntries = [];

      const result = component.canShowForm();

      expect(result).toBeTrue();
    });

    it('should return false if 6 days passed', () => {
      component.previousBmiEntries.push({
        bmi: 0,
        dateAdded: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      });

      const result = component.canShowForm();

      expect(result).toBeFalse();
    });
  });
});

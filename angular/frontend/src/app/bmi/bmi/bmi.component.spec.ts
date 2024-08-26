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
import { of, throwError } from 'rxjs';
import { TimeModule } from 'src/app/time/time.module';
import { IBmiGraphData } from 'src/interfaces/ibmi-graph-data';
import { IBmi } from 'src/interfaces/ibmi';
import { IResponseBmi } from 'src/interfaces/iresponse-bmi';

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
        TimeModule,
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
    it('should set previous bmi entries if there are any', () => {
      spyOn(bmiService, 'getPreviousBmiEntries').and.returnValue(of());

      component.ngOnInit();

      expect(bmiService.getPreviousBmiEntries).toHaveBeenCalled();
    });

    it('should set previous bmi entries if backend returned OK', () => {
      const previousEntry: IBmiGraphData = { bmi: 0, dateAdded: new Date() };
      spyOn(bmiService, 'getPreviousBmiEntries').and.returnValue(
        of([previousEntry])
      );

      component.ngOnInit();

      expect(component.previousBmiEntries.length).toBe(1);
      expect(component.previousBmiEntries[0]).toEqual(previousEntry);
    });

    it('should set display error message if there was an error fetchig bmi entries', () => {
      spyOn(bmiService, 'getPreviousBmiEntries').and.returnValue(
        throwError(() => new Error('Backend error!'))
      );

      component.ngOnInit();

      expect(component.errorMessage).toBeTruthy();
    });
  });

  describe('checkIfFormCanBeShown', () => {
    it('should return true if no previous bmi entries!', () => {
      component.previousBmiEntries = [];
      jasmine.clock().install();
      component.checkIfFormCanBeShown(new Date());
      jasmine.clock().tick(1000);

      jasmine.clock().uninstall();

      expect(component.canShow).toBeTrue();
    });

    it('should set canShow to false if 6 days passed', () => {
      component.previousBmiEntries.push({
        bmi: 0,
        dateAdded: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      });

      jasmine.clock().install();
      component.checkIfFormCanBeShown(new Date());
      jasmine.clock().tick(1000);

      jasmine.clock().uninstall();

      expect(component.canShow).toBeFalse();
    });

    it('should set canShow to true if 7 days passed', () => {
      component.previousBmiEntries.push({
        bmi: 0,
        dateAdded: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      });

      jasmine.clock().install();
      component.checkIfFormCanBeShown(new Date());
      jasmine.clock().tick(1000);

      jasmine.clock().uninstall();

      expect(component.canShow).toBeTrue();
    });

    it('should set canShow to true if 8 days passed', () => {
      component.previousBmiEntries.push({
        bmi: 0,
        dateAdded: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      });

      jasmine.clock().install();
      component.checkIfFormCanBeShown(new Date());
      jasmine.clock().tick(1000);

      jasmine.clock().uninstall();

      expect(component.canShow).toBeTrue();
    });
  });
  describe('sendBmi', () => {
    it('should use bmi service to post to server', () => {
      const mockBody: IResponseBmi = { bmi: 17.5 };
      spyOn(bmiService, 'sendBmiData').and.returnValue(of(mockBody));
      const formData: IBmi = { height: 66.6, weight: 1.5 };

      component.sendBmi(formData);

      expect(bmiService.sendBmiData).toHaveBeenCalled();
    });

    it('should set canShow to false if server posting was a success', () => {
      const mockBody: IResponseBmi = { bmi: 17.5 };
      spyOn(bmiService, 'sendBmiData').and.returnValue(of(mockBody));
      const formData: IBmi = { height: 66.6, weight: 1.5 };

      component.sendBmi(formData);

      expect(component.canShow).toBeFalse();
    });

    it('should set paragraph to display BMI', () => {
      const mockBody: IResponseBmi = { bmi: 17.5 };
      spyOn(bmiService, 'sendBmiData').and.returnValue(of(mockBody));
      const formData: IBmi = { height: 66.6, weight: 1.5 };

      component.sendBmi(formData);

      expect(component.errorMessage).toBeTruthy();
    });

    it('should display custom error message if server sent error', () => {
      const mockBody: IResponseBmi = { bmi: 17.5 };
      spyOn(bmiService, 'sendBmiData').and.returnValue(
        throwError(() => new Error('Backend error!'))
      );
      const formData: IBmi = { height: 66.6, weight: 1.5 };

      component.sendBmi(formData);

      expect(component.errorMessage).toBeTruthy();
    });
  });
});

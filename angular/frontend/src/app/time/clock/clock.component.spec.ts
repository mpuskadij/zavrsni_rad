import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockComponent } from './clock.component';
import { TimeService } from '../time-service/time.service';
import { IServerTime } from 'src/interfaces/iserver-time';
import { Observable, of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ClockComponent', () => {
  let component: ClockComponent;
  let fixture: ComponentFixture<ClockComponent>;
  let timeService: TimeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ClockComponent],
      providers: [TimeService],
    }).compileComponents();

    fixture = TestBed.createComponent(ClockComponent);
    component = fixture.componentInstance;
    timeService = TestBed.inject(TimeService);
    fixture.detectChanges();
  });

  describe('UI', () => {
    it('should display a paragraph without note if server responded with time', () => {
      const mockResponseBody: IServerTime = {
        time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      };
      spyOn(timeService, 'getServerTime').and.returnValue(of(mockResponseBody));
      component.ngOnInit();
      fixture.detectChanges();
      const ui: HTMLElement = fixture.nativeElement;

      const p = ui.querySelector('p[id="clock"]');
      const note = ui.querySelector('p[id="note"]');

      expect(component.note).toBeFalsy();
      expect(p).not.toBeNull();
      expect(note).toBeNull();
      expect(p?.innerHTML).toEqual(mockResponseBody.time.toLocaleString());
    });

    it('should display a note if server time could not be received with current time', () => {
      spyOn(timeService, 'getServerTime').and.returnValue(
        throwError(() => new Error('Backend error!'))
      );
      component.ngOnInit();
      fixture.detectChanges();
      const ui: HTMLElement = fixture.nativeElement;

      const p = ui.querySelector('p[id="note"]');
      const allParagraphs = ui.querySelectorAll('p');

      expect(allParagraphs.length).toBe(2);
      expect(component.note).toBeTruthy();
      expect(p).not.toBeNull();
      expect(p?.innerHTML).toEqual(component.note);
    });
  });

  describe('ngOnInit', () => {
    it('should fetch server time and store into property', () => {
      component.ngOnInit();

      expect(component.time).not.toBeNull();
    });

    it('should set time property if fetch was a success', () => {
      const mockResponseBody: IServerTime = {
        time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      };
      spyOn(timeService, 'getServerTime').and.returnValue(of(mockResponseBody));
      component.ngOnInit();

      expect(component.note).toBeFalsy();
      expect(component.time).toEqual(mockResponseBody.time);
    });

    it('should emit event if fetching server time was a success', () => {
      const mockResponseBody: IServerTime = {
        time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      };
      spyOn(timeService, 'getServerTime').and.returnValue(of(mockResponseBody));
      spyOn(component.onTimeSet, 'emit');
      component.ngOnInit();

      expect(component.onTimeSet.emit).toHaveBeenCalled();
    });

    it('should emit event if fetching server time was not a success', () => {
      spyOn(timeService, 'getServerTime').and.returnValue(
        throwError(() => new Error('Backend error!'))
      );
      spyOn(component.onTimeSet, 'emit');
      component.ngOnInit();

      expect(component.onTimeSet.emit).toHaveBeenCalled();
    });

    it('should not set time property if fetch was a success', () => {
      spyOn(timeService, 'getServerTime').and.returnValue(
        throwError(() => new Error('Error fetching time!'))
      );
      component.ngOnInit();

      expect(component.note).toBeTruthy();
      expect(component.time.toLocaleDateString()).toEqual(
        new Date().toLocaleDateString()
      );
    });
  });
});

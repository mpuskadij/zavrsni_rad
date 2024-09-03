import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalComponent } from './journal.component';
import { TimeModule } from 'src/app/time/time.module';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JournalService } from '../journal-service/journal.service';
import { of, throwError } from 'rxjs';
import { IPreviousJournalEntry } from 'src/interfaces/iprevious-journal-entry';

describe('JournalComponent', () => {
  let component: JournalComponent;
  let fixture: ComponentFixture<JournalComponent>;
  let journalService: JournalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JournalComponent],
      imports: [
        TimeModule,
        NavigationComponent,
        AppRoutingModule,
        HttpClientTestingModule,
      ],
      providers: [JournalService],
    }).compileComponents();

    fixture = TestBed.createComponent(JournalComponent);
    journalService = TestBed.inject(JournalService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set note if server sent error', () => {
      spyOn(journalService, 'getPreviousEntries').and.returnValue(
        throwError(() => new Error('Backend error'))
      );
      component.ngOnInit();

      expect(journalService.getPreviousEntries).toHaveBeenCalled();
      expect(component.note).toBeTruthy();
    });

    it('should set note if server sent data', () => {
      const previousEntry: IPreviousJournalEntry = {
        dateAdded: new Date(),
        description: '',
        id: 1,
        title: 's',
      };
      const response = [previousEntry];
      spyOn(journalService, 'getPreviousEntries').and.returnValue(of(response));
      component.ngOnInit();

      expect(journalService.getPreviousEntries).toHaveBeenCalled();
      expect(component.previousJournalEntries).toEqual(response);
    });
  });

  describe('editEntry', () => {
    it('should navigate when called', () => {
      const entry: IPreviousJournalEntry = {
        id: NaN,
        title: '',
        description: '',
        dateAdded: new Date(),
      };
      component.editEntry(entry);
      expect(component.note).toBeTruthy();
    });
  });

  describe('navigateToForm', () => {
    it('should navigate when called', () => {
      expect(component.navigateToForm()).toBe(void 0);
    });
  });
});

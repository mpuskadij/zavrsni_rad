import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPreviousEntryComponent } from './edit-previous-entry.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JournalService } from '../journal-service/journal.service';
import { TimeModule } from 'src/app/time/time.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { of, throwError } from 'rxjs';
import { IPreviousJournalEntry } from 'src/interfaces/iprevious-journal-entry';
import { ExerciseComponent } from 'src/app/workout-plan/exercise/exercise.component';

describe('EditPreviousEntryComponent', () => {
  let component: EditPreviousEntryComponent;
  let fixture: ComponentFixture<EditPreviousEntryComponent>;
  let journalService: JournalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPreviousEntryComponent],
      imports: [
        HttpClientTestingModule,
        TimeModule,
        ReactiveFormsModule,
        NavigationComponent,
        AppRoutingModule,
      ],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPreviousEntryComponent);
    component = fixture.componentInstance;
    journalService = TestBed.inject(JournalService);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set note if id is empty', () => {
      component.id = '';

      component.ngOnInit();
      expect(component.note).toBeTruthy();
    });

    it('should set note if server sent error', () => {
      component.id = '1';
      spyOn(journalService, 'getPreviousEntryDetails').and.returnValue(
        throwError(() => new Error('Backend error'))
      );

      component.ngOnInit();

      expect(journalService.getPreviousEntryDetails).toHaveBeenCalled();
      expect(component.note).toBeTruthy();
    });

    it('should set property if server sent details', () => {
      component.id = '1';
      const details: IPreviousJournalEntry = {
        id: 1,
        dateAdded: new Date(),
        description: 'a',
        title: 'a',
      };
      spyOn(journalService, 'getPreviousEntryDetails').and.returnValue(
        of(details)
      );

      component.ngOnInit();

      expect(journalService.getPreviousEntryDetails).toHaveBeenCalled();
      expect(component.entry).toEqual(details);
    });
  });

  describe('updateEntry', () => {
    it('should set note if server returned error', () => {
      spyOn(journalService, 'updatePreviousJournalEntry').and.returnValue(
        throwError(() => new Error('Backend error!'))
      );
      component.entry = {
        dateAdded: new Date(),
        description: 'asda',
        title: 'asdasd',
        id: 1,
      };
      component.form.controls.title!.setValue('abc');
      component.form.controls.description!.setValue('asda');
      component.updateEntry();
      expect(journalService.updatePreviousJournalEntry).toHaveBeenCalled();
    });

    it('should navigate if no server error was returned', () => {
      spyOn(journalService, 'updatePreviousJournalEntry').and.returnValue(of());
      component.entry = {
        dateAdded: new Date(),
        description: 'asda',
        title: 'asdasd',
        id: 1,
      };
      component.form.controls.title!.setValue('abc');
      component.form.controls.description!.setValue('asda');
      expect(component.updateEntry()).toBe(void 0);
      expect(journalService.updatePreviousJournalEntry).toHaveBeenCalled();
    });
  });

  describe('deleteEntry', () => {
    it('should set note if id is NaN', () => {
      component.entry = {
        dateAdded: new Date(),
        description: 'sdad',
        id: NaN,
        title: 'ASDASD',
      };
      component.deleteEntry();

      expect(component.note).toBeTruthy();
    });

    it('should set note if server did not delete', () => {
      spyOn(journalService, 'deletePreviousJournalEntry').and.returnValue(
        throwError(() => new Error('Backend error!'))
      );
      component.entry = {
        dateAdded: new Date(),
        description: 'sdad',
        id: 1,
        title: 'ASDASD',
      };
      component.deleteEntry();
      expect(journalService.deletePreviousJournalEntry).toHaveBeenCalled();
      expect(component.note).toBeTruthy();
    });

    it('should set note if server did not delete', () => {
      spyOn(journalService, 'deletePreviousJournalEntry').and.returnValue(
        throwError(() => new Error('Backend error!'))
      );
      component.entry = {
        dateAdded: new Date(),
        description: 'sdad',
        id: 1,
        title: 'ASDASD',
      };
      component.deleteEntry();
      expect(journalService.deletePreviousJournalEntry).toHaveBeenCalled();
      expect(component.note).toBeTruthy();
    });

    it('should set note if server did not delete', () => {
      spyOn(journalService, 'deletePreviousJournalEntry').and.returnValue(of());
      component.entry = {
        dateAdded: new Date(),
        description: 'sdad',
        id: 1,
        title: 'ASDASD',
      };
      expect(component.deleteEntry()).toBe(void 0);
      expect(journalService.deletePreviousJournalEntry).toHaveBeenCalled();
    });
  });
});

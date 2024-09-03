import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJournalEntryComponent } from './create-journal-entry.component';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { TimeModule } from 'src/app/time/time.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JournalService } from '../journal-service/journal.service';
import { of, throwError } from 'rxjs';

describe('CreateJournalEntryComponent', () => {
  let component: CreateJournalEntryComponent;
  let fixture: ComponentFixture<CreateJournalEntryComponent>;
  let journalService: JournalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateJournalEntryComponent],
      imports: [
        NavigationComponent,
        AppRoutingModule,
        TimeModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateJournalEntryComponent);
    journalService = TestBed.inject(JournalService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('createEntry', () => {
    it('should set note if form is invalid', () => {
      component.createEntry();

      expect(component.note).toBeTruthy();
    });

    it('should set note if server sent an error', () => {
      spyOn(journalService, 'addNewJournalEntry').and.returnValue(
        throwError(() => new Error('Backend error!'))
      );
      component.form.controls.title.setValue('test');
      component.form.controls.description.setValue('test');

      component.createEntry();

      expect(journalService.addNewJournalEntry).toHaveBeenCalled();
      expect(component.note).toBeTruthy();
    });

    it('should set note if server sent 201', () => {
      spyOn(journalService, 'addNewJournalEntry').and.returnValue(of());
      component.form.controls.title.setValue('test');
      component.form.controls.description.setValue('test');

      expect(component.createEntry()).toBe(void 0);
      expect(journalService.addNewJournalEntry).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should navigate when called', () => {
      expect(component.close()).toBe(void 0);
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJournalEntryComponent } from './create-journal-entry.component';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { TimeModule } from 'src/app/time/time.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JournalService } from '../journal-service/journal.service';

describe('CreateJournalEntryComponent', () => {
  let component: CreateJournalEntryComponent;
  let fixture: ComponentFixture<CreateJournalEntryComponent>;

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
      providers: [JournalService],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateJournalEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

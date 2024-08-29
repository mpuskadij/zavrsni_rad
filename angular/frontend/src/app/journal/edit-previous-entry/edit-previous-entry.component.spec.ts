import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPreviousEntryComponent } from './edit-previous-entry.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JournalService } from '../journal-service/journal.service';
import { TimeModule } from 'src/app/time/time.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

describe('EditPreviousEntryComponent', () => {
  let component: EditPreviousEntryComponent;
  let fixture: ComponentFixture<EditPreviousEntryComponent>;

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
      providers: [JournalService],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPreviousEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

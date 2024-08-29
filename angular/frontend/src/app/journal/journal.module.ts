import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalComponent } from './journal/journal.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { TimeModule } from '../time/time.module';
import { JournalService } from './journal-service/journal.service';
import { CreateJournalEntryComponent } from './create-journal-entry/create-journal-entry.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditPreviousEntryComponent } from './edit-previous-entry/edit-previous-entry.component';

@NgModule({
  declarations: [
    JournalComponent,
    CreateJournalEntryComponent,
    EditPreviousEntryComponent,
  ],
  imports: [NavigationComponent, TimeModule, CommonModule, ReactiveFormsModule],
  providers: [],
  exports: [
    JournalComponent,
    CreateJournalEntryComponent,
    EditPreviousEntryComponent,
  ],
})
export class JournalModule {}

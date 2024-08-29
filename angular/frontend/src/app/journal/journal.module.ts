import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalComponent } from './journal/journal.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { TimeModule } from '../time/time.module';
import { JournalService } from './journal-service/journal.service';
import { CreateJournalEntryComponent } from './create-journal-entry/create-journal-entry.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [JournalComponent, CreateJournalEntryComponent],
  imports: [NavigationComponent, TimeModule, CommonModule, ReactiveFormsModule],
  providers: [JournalService],
  exports: [JournalComponent, CreateJournalEntryComponent],
})
export class JournalModule {}

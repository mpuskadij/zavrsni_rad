import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JournalService } from '../journal-service/journal.service';
import { IPreviousJournalEntry } from 'src/interfaces/iprevious-journal-entry';
import { IDeleteJournalEntry } from 'src/interfaces/idelete-journal-entry';
import { Router } from '@angular/router';
import { IUpdateJournalEntry } from 'src/interfaces/iupdate-journal-entry';

@Component({
  selector: 'app-edit-previous-entry',
  templateUrl: './edit-previous-entry.component.html',
  styleUrl: './edit-previous-entry.component.scss',
})
export class EditPreviousEntryComponent implements OnInit {
  @Input({ required: true }) id = '';

  entry?: IPreviousJournalEntry;

  rows = 10;
  cols = 100;

  form = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required]],
  });

  note = '';

  constructor(
    private formBuilder: FormBuilder,
    private journalService: JournalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    try {
      if (!+this.id) throw new Error('ID is invalid!');
      this.journalService.getPreviousEntryDetails(+this.id).subscribe({
        next: (entryDetails) => {
          this.entry = entryDetails;
          this.form.controls.title.setValue(entryDetails.title);
          this.form.controls.description.setValue(entryDetails.description);
        },
        error: () => {
          this.note =
            'Something went wrong while trying to get details of journal entry!';
        },
      });
    } catch (error: any) {
      this.note = error.message;
    }
  }

  updateEntry() {
    try {
      if (this.form.invalid || !this.entry?.id)
        throw new Error('Invalid journal entry details!');
      const body: IUpdateJournalEntry = {
        description: this.form.controls.description.value!,
        title: this.form.controls.title.value!,
        id: this.entry.id,
      };
      this.journalService.updatePreviousJournalEntry(body).subscribe({
        next: () => {
          this.router.navigate(['/journal']);
        },
        error: () => {
          this.note =
            'Something went wrong while trying to update journal entry!';
        },
      });
    } catch (error: any) {
      this.note = error.messsage;
    }
  }

  deleteEntry() {
    const body: IDeleteJournalEntry = {
      id: this.entry!.id,
    };
    try {
      this.journalService.deletePreviousJournalEntry(body).subscribe({
        next: () => {
          this.router.navigate(['/journal'], { replaceUrl: true });
        },
        error: () => {
          this.note =
            'Something went wrong while trying to delete the journal entry!';
        },
      });
    } catch (error: any) {
      this.note = error.message;
    }
  }
}

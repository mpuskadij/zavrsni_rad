import { Component, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JournalService } from '../journal-service/journal.service';
import { ICreateJournalEntry } from 'src/interfaces/icreate-journal-entry';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-journal-entry',
  templateUrl: './create-journal-entry.component.html',
  styleUrl: './create-journal-entry.component.scss',
})
export class CreateJournalEntryComponent {
  public form = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required]],
  });
  public note = '';
  rows = 10;
  cols = 100;

  constructor(
    private formBuilder: FormBuilder,
    private journalService: JournalService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  createEntry() {
    try {
      if (this.form.invalid) {
        throw new Error('Missing title and/or description!');
      }
      const title = this.form.controls.title.value!;
      const description = this.form.controls.description.value!;
      const body: ICreateJournalEntry = {
        description: description,
        title: title,
      };
      this.journalService.addNewJournalEntry(body).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.router.navigate(['/journal'], { replaceUrl: true });
          });
        },
        error: () => {
          this.note = 'You already have a journal entry today!';
        },
      });
    } catch (error: any) {
      this.note = error.message;
    }
  }

  close() {
    this.ngZone.run(() => {
      this.router.navigate(['/journal'], { replaceUrl: true });
    });
  }
}

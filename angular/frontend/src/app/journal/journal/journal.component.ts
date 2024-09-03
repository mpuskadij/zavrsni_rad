import { Component, NgZone, OnInit } from '@angular/core';
import { IPreviousJournalEntry } from 'src/interfaces/iprevious-journal-entry';
import { JournalService } from '../journal-service/journal.service';
import { map } from 'rxjs';
import { IDeleteJournalEntry } from 'src/interfaces/idelete-journal-entry';
import { Router } from '@angular/router';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrl: './journal.component.scss',
})
export class JournalComponent implements OnInit {
  previousJournalEntries: IPreviousJournalEntry[] = [];
  note = '';

  constructor(
    private journalService: JournalService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.journalService
      .getPreviousEntries()
      .pipe(
        map((previousEntries) => {
          previousEntries.forEach((entry) => {
            entry.dateAdded = new Date(entry.dateAdded);
          });
          return previousEntries;
        })
      )
      .subscribe({
        next: (previousEntriesFromServer) => {
          this.previousJournalEntries = previousEntriesFromServer;
        },
        error: () => {
          this.note = 'No entries yet!';
        },
      });
  }

  editEntry(entry: IPreviousJournalEntry) {
    if (isNaN(entry.id)) {
      this.note = 'Cannot edit journal entry with invalid id!';
      return;
    }
    this.ngZone.run(() => {
      this.router.navigate([`/journal/edit/${entry.id}`]);
    });
  }

  navigateToForm() {
    this.ngZone.run(() => {
      this.router.navigate(['/journal/add']);
    });
  }
}

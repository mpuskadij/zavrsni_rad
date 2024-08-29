import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICreateJournalEntry } from 'src/interfaces/icreate-journal-entry';
import { IDeleteJournalEntry } from 'src/interfaces/idelete-journal-entry';
import { IPreviousJournalEntry } from 'src/interfaces/iprevious-journal-entry';

@Injectable({
  providedIn: 'root',
})
export class JournalService {
  private endPoint: string = `${environment.apiUrl}journal`;
  constructor(private httpClient: HttpClient) {}

  getPreviousEntries() {
    return this.httpClient.get<IPreviousJournalEntry[]>(this.endPoint, {
      observe: 'body',
      responseType: 'json',
    });
  }

  deletePreviousJournalEntry(body: IDeleteJournalEntry) {
    return this.httpClient.delete(this.endPoint, {
      body: body,
      observe: 'response',
    });
  }

  addNewJournalEntry(body: ICreateJournalEntry) {
    if (!body.description || !body.title) {
      throw new Error('Title and/or description not provided!');
    }
    return this.httpClient.post(this.endPoint, body, {
      observe: 'response',
    });
  }
}

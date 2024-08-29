import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICreateJournalEntry } from 'src/interfaces/icreate-journal-entry';
import { IDeleteJournalEntry } from 'src/interfaces/idelete-journal-entry';
import { IPreviousJournalEntry } from 'src/interfaces/iprevious-journal-entry';
import { IUpdateJournalEntry } from 'src/interfaces/iupdate-journal-entry';

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

  getPreviousEntryDetails(id: number) {
    if (isNaN(id)) {
      throw new Error('ID is invalid!');
    }
    return this.httpClient.get<IPreviousJournalEntry>(
      `${this.endPoint}/${id}`,
      {
        observe: 'body',
        responseType: 'json',
      }
    );
  }

  updatePreviousJournalEntry(body: IUpdateJournalEntry) {
    if (!body.description.length || !body.title.length || isNaN(body.id)) {
      throw new Error('Invalid journal entry title and/or description!');
    }
    return this.httpClient.put(this.endPoint, body, {
      observe: 'response',
    });
  }

  deletePreviousJournalEntry(body: IDeleteJournalEntry) {
    if (isNaN(body.id)) {
      throw new Error('Invalid id!');
    }
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

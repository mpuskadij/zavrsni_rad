import { TestBed } from '@angular/core/testing';

import { JournalService } from './journal.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IUpdateJournalEntry } from 'src/interfaces/iupdate-journal-entry';
import { IDeleteJournalEntry } from 'src/interfaces/idelete-journal-entry';
import { ICreateJournalEntry } from 'src/interfaces/icreate-journal-entry';

describe('JournalService', () => {
  let service: JournalService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JournalService],
    });
    service = TestBed.inject(JournalService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('getPreviousEntries', () => {
    it('should use http client to GET data', () => {
      service.getPreviousEntries().subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}journal`
      );

      expect(request.request.method).toBe('GET');
    });
  });

  describe('getPreviousEntryDetails', () => {
    it('should throw error if id is NaN', () => {
      const result = () => service.getPreviousEntryDetails(NaN);

      expect(result).toThrow();
    });

    it('should use http client to GET data', () => {
      const id = 2;
      service.getPreviousEntryDetails(2).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}journal/${id}`
      );

      expect(request.request.method).toBe('GET');
    });
  });

  describe('updatePreviousJournalEntry', () => {
    it('should throw error if title is empty', () => {
      const result = () =>
        service.updatePreviousJournalEntry({
          title: '',
          description: 'a',
          id: 2,
        });

      expect(result).toThrow();
    });

    it('should throw error if description is empty', () => {
      const result = () =>
        service.updatePreviousJournalEntry({
          title: 'a',
          description: '',
          id: 2,
        });

      expect(result).toThrow();
    });

    it('should throw error if id is NaN', () => {
      const result = () =>
        service.updatePreviousJournalEntry({
          title: 'a',
          description: 'a',
          id: NaN,
        });

      expect(result).toThrow();
    });

    it('should use http client to PUT data', () => {
      const data: IUpdateJournalEntry = {
        description: 'asdasd',
        title: 'sfasd',
        id: 2,
      };
      service.updatePreviousJournalEntry(data).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}journal`
      );

      expect(request.request.body).not.toBeNull();
      expect(request.request.method).toBe('PUT');
    });
  });

  describe('deletePreviousJournalEntry', () => {
    it('should throw error if id is NaN', () => {
      const data: IDeleteJournalEntry = { id: NaN };
      const result = () => service.deletePreviousJournalEntry(data);

      expect(result).toThrow();
    });

    it('should use http client to DELETE data', () => {
      const data: IDeleteJournalEntry = { id: 2 };
      service.deletePreviousJournalEntry(data).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}journal`
      );

      expect(request.request.method).toBe('DELETE');
    });
  });

  describe('addNewJournalEntry', () => {
    it('should throw error if title is empty', () => {
      const result = () =>
        service.addNewJournalEntry({
          title: '',
          description: 'a',
        });

      expect(result).toThrow();
    });

    it('should throw error if title is empty', () => {
      const result = () =>
        service.addNewJournalEntry({
          title: 'a',
          description: '',
        });

      expect(result).toThrow();
    });

    it('should use http client to PUT data', () => {
      const data: ICreateJournalEntry = {
        description: 'asdasd',
        title: 'sfasd',
      };
      service.addNewJournalEntry(data).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}journal`
      );

      expect(request.request.body).not.toBeNull();
      expect(request.request.method).toBe('POST');
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});

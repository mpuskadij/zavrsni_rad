import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IServerTime } from 'src/interfaces/iserver-time';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  private timeApiEndpoint = `${environment.url}time`;
  constructor(private httpClient: HttpClient) {}
  getServerTime(): Observable<IServerTime> {
    return this.httpClient.get<IServerTime>(this.timeApiEndpoint, {
      observe: 'body',
      responseType: 'json',
    });
  }
}

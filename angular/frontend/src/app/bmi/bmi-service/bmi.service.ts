import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IBmi } from 'src/interfaces/ibmi';
import { IBmiGraphData } from 'src/interfaces/ibmi-graph-data';
import { IResponseBmi } from 'src/interfaces/iresponse-bmi';

@Injectable({
  providedIn: 'root',
})
export class BmiService {
  private endPoint: string = `${environment.apiUrl}bmi`;

  constructor(private httpClient: HttpClient) {}

  sendBmiData(bmi: IBmi): Observable<IResponseBmi> {
    if (bmi.height < 0 || bmi.weight < 0) {
      throw new Error('Height and weight must be > 0');
    }

    return this.httpClient.post<IResponseBmi>(
      this.endPoint,
      JSON.stringify(bmi),
      {
        observe: 'body',
      }
    );
  }

  getPreviousBmiEntries(): Observable<IBmiGraphData[]> {
    return this.httpClient.get<IBmiGraphData[]>(this.endPoint, {
      responseType: 'json',
      observe: 'body',
    });
  }
}

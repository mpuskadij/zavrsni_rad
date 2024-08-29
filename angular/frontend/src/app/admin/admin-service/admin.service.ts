import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IChangeActiveStatus } from 'src/interfaces/ichange-active-status';
import { IExistingUser } from 'src/interfaces/iexisting-user';
import { IOffset } from 'src/interfaces/ioffset';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private userEndPoint = `${environment.apiUrl}users`;
  private timeEndPoint = `${environment.apiUrl}time`;
  constructor(private httpClient: HttpClient) {}

  getAllUsers() {
    return this.httpClient.get<IExistingUser[]>(this.userEndPoint, {
      observe: 'body',
      responseType: 'json',
    });
  }

  changeStatus(parameters: IChangeActiveStatus) {
    return this.httpClient.put(
      `${this.userEndPoint}/${parameters.username}`,
      undefined,
      {
        observe: 'response',
      }
    );
  }

  setOffset(body: IOffset) {
    if (isNaN(body.offset)) {
      throw new Error('Invalid offset!');
    }

    return this.httpClient.put(this.timeEndPoint, body, {
      observe: 'response',
    });
  }
}

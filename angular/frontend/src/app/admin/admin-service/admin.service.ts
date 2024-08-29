import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IChangeActiveStatus } from 'src/interfaces/ichange-active-status';
import { IExistingUser } from 'src/interfaces/iexisting-user';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private endPoint = `${environment.apiUrl}users`;
  constructor(private httpClient: HttpClient) {}

  getAllUsers() {
    return this.httpClient.get<IExistingUser[]>(this.endPoint, {
      observe: 'body',
      responseType: 'json',
    });
  }

  changeStatus(parameters: IChangeActiveStatus) {
    return this.httpClient.put(
      `${this.endPoint}/${parameters.username}`,
      undefined,
      {
        observe: 'response',
      }
    );
  }
}

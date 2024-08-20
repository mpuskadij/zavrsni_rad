import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from 'src/interfaces/iuser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private endpoint: string = 'api/users/';
  register(user: IUser) {
    if (!user.username.length || !user.password.length) {
      throw new Error('Username and password are both required!');
    }
    return this.httpClient.post(
      `${environment.url}${this.endpoint}register`,
      user
    );
  }

  login(user: IUser) {
    if (!user.username.length || !user.password.length) {
      throw new Error('Username and password are both required!');
    }
    return this.httpClient.post(
      `${environment.url}${this.endpoint}login`,
      user
    );
  }

  constructor(private httpClient: HttpClient) {}
}

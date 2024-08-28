import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ILoginData } from 'src/interfaces/ilogin-data';
import { IUser } from 'src/interfaces/iuser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private endpoint: string = 'users/';
  register(user: IUser, token: string) {
    if (!user.username.length || !user.password.length || !token) {
      throw new Error('Username and password are both required!');
    }
    return this.httpClient.post<HttpResponse<object>>(
      `${environment.apiUrl}${this.endpoint}register`,
      user,
      {
        observe: 'response',
        responseType: 'json',
        headers: {
          recaptcha: token,
        },
      }
    );
  }

  login(user: IUser, token: string) {
    if (!user.username.length || !user.password.length || !token) {
      throw new Error('Username and password are both required!');
    }
    return this.httpClient.post<ILoginData>(
      `${environment.apiUrl}${this.endpoint}login`,
      user,
      {
        observe: 'body',
        responseType: 'json',
        headers: {
          recaptcha: token,
        },
      }
    );
  }

  constructor(private httpClient: HttpClient) {}
}

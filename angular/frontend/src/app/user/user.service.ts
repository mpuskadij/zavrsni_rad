import { Injectable } from '@angular/core';
import { IUser } from 'src/interfaces/iuser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  register(user: IUser) {
    if (!user.username.length || user.password.length) {
      throw new Error('Username and password are both required!');
    }
  }

  constructor() {}
}

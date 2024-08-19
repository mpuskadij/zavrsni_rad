import { Component } from '@angular/core';
import { IUser } from 'src/interfaces/iuser';
import { UserService } from '../user-service/user.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public errorMessage: string = '';

  constructor(private userService: UserService) {}
  sendRegistrationCredentials(user: IUser) {
    try {
      if (!user.password.length || !user.username.length) {
        throw new Error('Username and/or password are required!');
      }
      this.userService
        .register(user)
        .pipe(
          catchError((error) => {
            this.errorMessage = error.message;
            return of();
          })
        )
        .subscribe(() => {});
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}

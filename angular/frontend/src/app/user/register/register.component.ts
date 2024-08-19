import { Component } from '@angular/core';
import { IUser } from 'src/interfaces/iuser';
import { UserService } from '../user-service/user.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public errorMessage: string = '';

  constructor(private userService: UserService) {}
  sendCredentials(user: IUser) {
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

import { Component } from '@angular/core';
import { IUser } from 'src/interfaces/iuser';
import { UserService } from '../user-service/user.service';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}
  sendRegistrationCredentials(user: IUser) {
    try {
      if (!user.password.length || !user.username.length) {
        throw new Error('Username and/or password are required!');
      }
      this.userService.register(user).subscribe({
        next: () => {
          this.sendLoginCredentials(user);
        },
        error: () => {
          this.errorMessage =
            'Something went wrong while trying to register your account!';
        },
      });
      //this.sendLoginCredentials(user);
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  sendLoginCredentials(user: IUser) {
    try {
      if (!user.password.length || !user.username.length) {
        throw new Error('Username and/or password are required!');
      }
      this.userService.login(user).subscribe({
        next: (loginData) => {
          sessionStorage.setItem('isAdmin', loginData.isAdmin.toString());
        },
        error: () => {
          this.errorMessage = 'Something went wrong while trying to login!';
        },
      });
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}

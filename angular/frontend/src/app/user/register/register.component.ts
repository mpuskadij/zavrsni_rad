import { Component } from '@angular/core';
import { IUser } from 'src/interfaces/iuser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public errorMessage: string = '';

  sendCredentials(user: IUser) {
    try {
      if (!user.password.length || !user.username.length) {
        throw new Error('Username is empty!');
      }
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}

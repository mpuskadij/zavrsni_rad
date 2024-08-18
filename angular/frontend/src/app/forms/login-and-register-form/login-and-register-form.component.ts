import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { IUser } from 'src/interfaces/iuser';

@Component({
  selector: 'app-login-and-register-form',
  templateUrl: './login-and-register-form.component.html',
  styleUrls: ['./login-and-register-form.component.scss'],
})
export class LoginAndRegisterFormComponent {
  public form = this.formBuilder.group({
    username: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(25)],
    ],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  public errorMessage: string = '';
  @Input({ required: true }) public buttonName: string = '';
  @Output() public onSubmit = new EventEmitter<IUser>();

  constructor(private formBuilder: FormBuilder) {}

  public submitForm() {
    const username = this.form.controls.username.value;
    const password = this.form.controls.password.value;
    try {
      if (username && password) {
        if (username.length < 5) {
          throw new Error('Username must be at least 5 characters!');
        }

        if (username.length > 25) {
          throw new Error('Max username length is 25 characters!');
        }

        if (!isNaN(Number(username))) {
          throw new Error('Username cannot be a number!');
        }

        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters!');
        }

        if (!isNaN(Number(password))) {
          throw new Error('Password cannot be a number!');
        }

        if (!/[A-Z]/.test(password)) {
          throw new Error('Password must contain at least 1 uppercase letter!');
        }

        if (!/[a-z]/.test(password)) {
          throw new Error('Password must contain at least 1 lowercase letter!');
        }

        const user: IUser = { username: username, password: password };

        this.onSubmit.emit(user);
      } else {
        throw new Error('Username and password are both required!');
      }
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}

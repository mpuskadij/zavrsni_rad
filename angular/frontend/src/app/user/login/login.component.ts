import { Component, NgZone, OnInit } from '@angular/core';
import { IUser } from 'src/interfaces/iuser';
import { UserService } from '../user-service/user.service';
import { catchError, of } from 'rxjs';
import { Router, UrlTree } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public form = this.formBuilder.group({
    username: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(25)],
    ],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  public errorMessage: string = '';
  private bmiPage: string = `${environment.apiUrl}bmi`;

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private recaptchaService: ReCaptchaV3Service,
    private ngZone: NgZone
  ) {}
  ngOnInit(): void {
    sessionStorage.removeItem('isAdmin');
  }

  private validateForm(): IUser {
    const username = this.form.controls.username.value;
    const password = this.form.controls.password.value;
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

      const user: IUser = { username: username, password: password };

      return user;
    } else {
      throw new Error('Username and password are both required!');
    }
  }

  public register() {
    try {
      const user = this.validateForm();
      this.recaptchaService.execute('register').subscribe({
        next: (token) => {
          this.userService.register(user, token).subscribe({
            next: () => {
              this.errorMessage = 'Registration was a success!';
            },
            error: () => {
              this.errorMessage =
                'Something went wrong while trying to register your account!';
            },
          });
        },
        error: () => {
          this.errorMessage = 'Something went wrong with recaptcha!';
        },
      });
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  public login() {
    try {
      const user = this.validateForm();
      this.recaptchaService.execute('login').subscribe({
        next: (token) => {
          this.userService.login(user, token).subscribe({
            next: (loginData) => {
              sessionStorage.setItem('isAdmin', loginData.isAdmin.toString());
              this.ngZone.run(() => {
                this.router.navigate(['/bmi']);
              });
            },
            error: () => {
              this.errorMessage = 'Username and/or password are invalid!';
            },
          });
        },
        error: () => {
          this.errorMessage = 'Recaptcha encountered an error!';
        },
      });
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}

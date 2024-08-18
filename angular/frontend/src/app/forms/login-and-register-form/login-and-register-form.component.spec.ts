import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAndRegisterFormComponent } from './login-and-register-form.component';

describe('LoginAndRegisterFormComponent', () => {
  let component: LoginAndRegisterFormComponent;
  let fixture: ComponentFixture<LoginAndRegisterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginAndRegisterFormComponent],
    });
    fixture = TestBed.createComponent(LoginAndRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('submitForm', () => {
    it('should set error message if username is empty', () => {
      component.form.controls.username.setValue('');
      component.submitForm();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if password is empty', () => {
      component.form.controls.username.setValue('marin');
      component.form.controls.password.setValue('');
      component.submitForm();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if username is 4 characters long', () => {
      component.form.controls.username.setValue('mari');
      component.form.controls.password.setValue('abchE8jh');
      component.submitForm();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if username is 26 characters long', () => {
      component.form.controls.username.setValue('pckhxatqkhhkphvbpflywaclwi');
      component.form.controls.password.setValue('abchE8jh');
      component.submitForm();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if username only contains numbers', () => {
      component.form.controls.username.setValue('1231231223');
      component.form.controls.password.setValue('abchE8jh');
      component.submitForm();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if password is 7 characters long', () => {
      component.form.controls.username.setValue('marin');
      component.form.controls.password.setValue('abcdefg');
      component.submitForm();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if password is only numbers', () => {
      component.form.controls.username.setValue('marin');
      component.form.controls.password.setValue('12345678');
      component.submitForm();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if password doesnt contain uppercase character', () => {
      component.form.controls.username.setValue('marin');
      component.form.controls.password.setValue('1234567s');
      component.submitForm();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should omit if username is 5 characters and password contains one number, one uppercase and 1 lowercase character', () => {
      component.form.controls.username.setValue('marin');
      component.form.controls.password.setValue('123456sS');

      expect(component.errorMessage).toBeFalsy();
    });
  });
});

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

  describe('UI', () => {
    it('should have a username label', () => {
      const ui: HTMLElement = fixture.nativeElement;

      const usernameLabel = ui.querySelector('label')!;
      expect(usernameLabel.htmlFor).toEqual('username');
    });

    it('should have a username input field', () => {
      const ui: HTMLElement = fixture.nativeElement;

      const usernameLabel = ui.querySelector('input')!;
      expect(usernameLabel.id).toEqual('username');
    });

    it('should have a password label field', () => {
      const ui: HTMLElement = fixture.nativeElement;

      const labels = ui.querySelectorAll('label')!;
      expect(labels.length).toEqual(2);
      expect(labels[1].htmlFor).toEqual('password');
    });

    it('should have a password input field', () => {
      const ui: HTMLElement = fixture.nativeElement;

      const labels = ui.querySelectorAll('input')!;
      expect(labels.length).toEqual(2);
      expect(labels[1].id).toEqual('password');
    });

    it('should have a button', () => {
      const ui: HTMLElement = fixture.nativeElement;

      const button = ui.querySelector('button')!;
      expect(button).not.toBeNull();
    });

    it('should have a button that is disabled on load', () => {
      const ui: HTMLElement = fixture.nativeElement;

      const button = ui.querySelector('button')!;
      expect(button.disabled).toBeTrue();
    });

    it('should not display a error message on load', () => {
      const ui: HTMLElement = fixture.nativeElement;

      const error = ui.querySelector('p')!;
      expect(error).toBeNull();
    });

    it('should have button based on passed input property', () => {
      const ui: HTMLElement = fixture.nativeElement;
      component.buttonName = 'Register';
      fixture.detectChanges();
      const button = ui.querySelector('button')!;
      expect(button.innerHTML).toContain('Register');
    });

    it('should have disabled button if username is not 5 characters and password is empty', () => {
      const ui: HTMLElement = fixture.nativeElement;
      const inputs = ui.querySelectorAll('input')!;

      component.form.controls.username.setValue('mari');
      fixture.detectChanges();

      const button = ui.querySelector('button')!;
      expect(button.disabled).toBeTrue();
    });

    it('should have disabled button if password is 7 characters and username is empty', () => {
      const ui: HTMLElement = fixture.nativeElement;
      const inputs = ui.querySelectorAll('input')!;
      component.form.controls.password.setValue('1234567');
      fixture.detectChanges();

      const button = ui.querySelector('button')!;
      expect(button.disabled).toBeTrue();
    });

    it('should have disabled button if username is 5 characters, but password is empty', () => {
      const ui: HTMLElement = fixture.nativeElement;
      const inputs = ui.querySelectorAll('input')!;

      component.form.controls.username.setValue('asdfg');
      fixture.detectChanges();

      const button = ui.querySelector('button')!;
      expect(button.disabled).toBeTrue();
    });

    it('should have disabled button if username is 5 characters, but password is 7 characters', async () => {
      const ui: HTMLElement = fixture.nativeElement;
      const inputs = ui.querySelectorAll('input')!;

      component.form.controls.username.setValue('asdfg');
      component.form.controls.password.setValue('1234567');
      fixture.detectChanges();

      const button = ui.querySelector('button')!;
      expect(button.disabled).toBeTrue();
    });

    it('should have a disabled button if username is 26 characters and password is 8 characters', () => {
      const ui: HTMLElement = fixture.nativeElement;
      const inputs = ui.querySelectorAll('input')!;
      const button = ui.querySelector('button')!;
      expect(button.disabled).toBeTrue();

      component.form.controls.username.setValue('asdfghjklpoiuztrewqyxcvbnm');
      component.form.controls.password.setValue('12345Hmf');
      fixture.detectChanges();

      expect(button.disabled).toBeTrue();
    });

    it('should not have a disabled button if username is 5 characters and password is 8 characters', () => {
      const ui: HTMLElement = fixture.nativeElement;
      const inputs = ui.querySelectorAll('input')!;
      const button = ui.querySelector('button')!;
      expect(button.disabled).toBeTrue();

      component.form.controls.username.setValue('asmfjgh');
      component.form.controls.password.setValue('12345Hmf');
      fixture.detectChanges();

      expect(button.disabled).toBeFalse();
    });
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
      spyOn(component.onSubmit, 'emit');
      component.form.controls.username.setValue('marin');
      component.form.controls.password.setValue('123456sS');

      component.submitForm();
      expect(component.errorMessage).toBeFalsy();
      expect(component.onSubmit.emit).toHaveBeenCalled();
    });
  });
});

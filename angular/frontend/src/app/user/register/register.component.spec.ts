import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { IUser } from '../../../interfaces/iuser';
import { FormsModule } from '../../forms/forms.module';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [RegisterComponent],
    });
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('sendCredentials', () => {
    it('should throw exception if username is missing', () => {
      const user: IUser = { username: '', password: 'akjldgkadgn23S' };
      component.sendCredentials(user);

      expect(component.errorMessage).toBeTruthy();
    });

    it('should throw exception if password is missing', () => {
      const user: IUser = { username: 'marin', password: '' };
      component.sendCredentials(user);

      expect(component.errorMessage).toBeTruthy();
    });
  });
});

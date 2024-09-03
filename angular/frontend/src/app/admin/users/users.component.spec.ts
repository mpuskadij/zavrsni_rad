import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { TimeModule } from 'src/app/time/time.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AdminService } from '../admin-service/admin.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EMPTY, of, throwError } from 'rxjs';
import { IExistingUser } from 'src/interfaces/iexisting-user';
import { HttpResponse } from '@angular/common/http';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let adminService: AdminService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
      imports: [
        NavigationComponent,
        TimeModule,
        AppRoutingModule,
        HttpClientTestingModule,
      ],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    adminService = TestBed.inject(AdminService);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set note if there was a server error', () => {
      spyOn(adminService, 'getAllUsers').and.returnValue(
        throwError(() => new Error('Backend error'))
      );
      component.ngOnInit();

      expect(adminService.getAllUsers).toHaveBeenCalled();
      expect(component.note).toBeTruthy();
    });

    it('should set note if there are no users', () => {
      const users: IExistingUser[] = [];
      spyOn(adminService, 'getAllUsers').and.returnValue(of(users));
      component.ngOnInit();

      expect(adminService.getAllUsers).toHaveBeenCalled();
      expect(component.users.length).toBe(0);
      expect(component.note).toBeTruthy();
    });

    it('should set note if there are no users', () => {
      const users: IExistingUser[] = [
        { isActive: false, isAdmin: false, username: 'asdasd' },
      ];
      spyOn(adminService, 'getAllUsers').and.returnValue(of(users));
      component.ngOnInit();

      expect(adminService.getAllUsers).toHaveBeenCalled();
      expect(component.note).toBeFalsy();
      expect(component.users).toEqual(users);
    });
  });

  describe('changeActiveStatus', () => {
    it('should set note if username is empty', () => {
      component.changeActiveStatus({
        isActive: false,
        isAdmin: false,
        username: '',
      });
      expect(component.note).toBeTruthy();
    });

    it('should set note if server had an error', () => {
      spyOn(adminService, 'changeStatus').and.returnValue(
        throwError(() => new Error('Backend error'))
      );
      component.changeActiveStatus({
        isActive: false,
        isAdmin: false,
        username: 'niram',
      });
      expect(adminService.changeStatus).toHaveBeenCalled();
      expect(component.note).toBeTruthy();
    });

    it('should change false to true status if server returned response', () => {
      const response = new HttpResponse({ body: {} });
      spyOn(adminService, 'changeStatus').and.returnValue(of(response));
      const user: IExistingUser = {
        isActive: false,
        isAdmin: false,
        username: 'niram',
      };
      +component.changeActiveStatus(user);
      expect(adminService.changeStatus).toHaveBeenCalled();
      expect(user.isActive).toBe(true);
    });

    it('should set true to false status', () => {
      const response = new HttpResponse({ body: {} });
      spyOn(adminService, 'changeStatus').and.returnValue(of(response));
      const user: IExistingUser = {
        isActive: true,
        isAdmin: false,
        username: 'niram',
      };
      component.changeActiveStatus(user);
      expect(adminService.changeStatus).toHaveBeenCalled();
      expect(user.isActive).toBe(false);
    });
  });
});

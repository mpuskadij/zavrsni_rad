import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';
import { AppRoutingModule } from '../app-routing.module';
import { NgZone } from '@angular/core';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let ngZone: NgZone;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationComponent, AppRoutingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    ngZone = TestBed.inject(NgZone);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set isLoggedIn to true if session storage isAdmin is true', () => {
      sessionStorage.setItem('isAdmin', 'true');

      component.ngOnInit();

      expect(component.isLoggedIn).toBeTrue();
    });

    it('should set isLoggedIn to true if session storage isAdmin is false', () => {
      sessionStorage.setItem('isAdmin', 'false');

      component.ngOnInit();

      expect(component.isLoggedIn).toBeTrue();
    });

    it('should set isLoggedIn to false if session storage isAdmin is neither true or false', () => {
      sessionStorage.setItem('isAdmin', '0');

      component.ngOnInit();

      expect(component.isLoggedIn).toBeFalse();
    });
  });

  describe('logout', () => {
    it('should remove isAdmin from session storage', () => {
      sessionStorage.setItem('isAdmin', 'true');
      component.logout();

      expect(sessionStorage.getItem('isAdmin')).toBeFalsy();
    });

    it('should not throw exception if isAdmin from session storage doesnt exist', () => {
      component.logout();

      expect(sessionStorage.getItem('isAdmin')).toBeFalsy();
    });

    it('should redirect to login page', () => {
      spyOn(ngZone, 'run');
      component.logout();

      expect(ngZone.run).toHaveBeenCalled();
    });
  });
});

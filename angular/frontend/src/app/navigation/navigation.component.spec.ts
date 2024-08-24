import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';
import { AppRoutingModule } from '../app-routing.module';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationComponent, AppRoutingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('UI', () => {
    it('should have a <nav> element', () => {
      const ui: HTMLElement = fixture.nativeElement;
      const nav = ui.querySelector('nav');

      expect(nav).not.toBeNull();
    });
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
});

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

    it('should have a /register link', () => {
      const ui: HTMLElement = fixture.nativeElement;
      const link = ui.querySelector('a[routerLink="/register"]');

      expect(link).not.toBeNull();
    });

    it('should have a /login link', () => {
      const ui: HTMLElement = fixture.nativeElement;
      const link = ui.querySelector('a[routerLink="/login"]');

      expect(link).not.toBeNull();
    });
  });
});

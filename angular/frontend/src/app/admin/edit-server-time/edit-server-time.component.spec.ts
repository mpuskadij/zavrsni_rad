import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServerTimeComponent } from './edit-server-time.component';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { TimeModule } from 'src/app/time/time.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminService } from '../admin-service/admin.service';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

describe('EditServerTimeComponent', () => {
  let component: EditServerTimeComponent;
  let fixture: ComponentFixture<EditServerTimeComponent>;
  let adminService: AdminService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditServerTimeComponent],
      imports: [
        NavigationComponent,
        AppRoutingModule,
        TimeModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(EditServerTimeComponent);
    component = fixture.componentInstance;
    adminService = TestBed.inject(AdminService);
    fixture.detectChanges();
  });

  describe('updateOffset', () => {
    it('should set note if form is invalid', () => {
      component.form.controls.offset.setValue(null);

      component.updateOffset();

      expect(component.note).toBeTruthy();
    });

    it('should set note if server had an error', () => {
      spyOn(adminService, 'setOffset').and.returnValue(
        throwError(() => new Error('Backend error!'))
      );

      component.updateOffset();

      expect(adminService.setOffset).toHaveBeenCalled();
      expect(component.note).toBeTruthy();
    });

    it('should set note if server did not have an error', () => {
      const response = new HttpResponse({ body: {} });
      spyOn(adminService, 'setOffset').and.returnValue(of(response));

      component.updateOffset();

      expect(adminService.setOffset).toHaveBeenCalled();
      expect(component.note).toBeTruthy();
    });
  });
});

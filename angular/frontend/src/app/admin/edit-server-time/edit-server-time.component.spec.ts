import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServerTimeComponent } from './edit-server-time.component';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { TimeModule } from 'src/app/time/time.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminService } from '../admin-service/admin.service';

describe('EditServerTimeComponent', () => {
  let component: EditServerTimeComponent;
  let fixture: ComponentFixture<EditServerTimeComponent>;

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
      providers: [AdminService],
    }).compileComponents();

    fixture = TestBed.createComponent(EditServerTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

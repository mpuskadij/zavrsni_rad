import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmiComponent } from './bmi.component';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { GraphsModule } from 'src/app/graphs/graphs.module';
import { FormsModule } from 'src/app/forms/forms.module';
import { RouterModule } from '@angular/router';

describe('BmiComponent', () => {
  let component: BmiComponent;
  let fixture: ComponentFixture<BmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BmiComponent],
      imports: [NavigationComponent, RouterModule, GraphsModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalComponent } from './journal.component';
import { TimeModule } from 'src/app/time/time.module';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JournalService } from '../journal-service/journal.service';

describe('JournalComponent', () => {
  let component: JournalComponent;
  let fixture: ComponentFixture<JournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JournalComponent],
      imports: [
        TimeModule,
        NavigationComponent,
        AppRoutingModule,
        HttpClientTestingModule,
      ],
      providers: [JournalService],
    }).compileComponents();

    fixture = TestBed.createComponent(JournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

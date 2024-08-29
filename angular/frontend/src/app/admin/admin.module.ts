import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';
import { TimeModule } from '../time/time.module';
import { UsersComponent } from './users/users.component';
import { EditServerTimeComponent } from './edit-server-time/edit-server-time.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UsersComponent, EditServerTimeComponent],
  imports: [NavigationComponent, TimeModule, CommonModule, ReactiveFormsModule],
  exports: [UsersComponent, EditServerTimeComponent],
})
export class AdminModule {}

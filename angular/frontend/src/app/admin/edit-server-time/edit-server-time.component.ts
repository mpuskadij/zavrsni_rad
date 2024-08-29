import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../admin-service/admin.service';
import { IOffset } from 'src/interfaces/ioffset';

@Component({
  selector: 'app-edit-server-time',
  templateUrl: './edit-server-time.component.html',
  styleUrl: './edit-server-time.component.scss',
})
export class EditServerTimeComponent {
  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService
  ) {}
  public form = this.formBuilder.group({
    offset: [0, [Validators.required]],
  });
  note = '';

  updateOffset() {
    try {
      if (this.form.invalid) {
        throw new Error('Invalid offset!');
      }
      const body: IOffset = { offset: this.form.controls.offset.value! };
      this.adminService.setOffset(body).subscribe({
        next: () => {
          this.note = 'Offset updated!';
        },
        error: () => {
          this.note = 'Someting went wrong while trying to update offset!';
        },
      });
    } catch (error: any) {
      this.note = error.message;
    }
  }
}

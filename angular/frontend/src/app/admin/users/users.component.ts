import { Component, OnInit } from '@angular/core';
import { IExistingUser } from 'src/interfaces/iexisting-user';
import { AdminService } from '../admin-service/admin.service';
import { IChangeActiveStatus } from 'src/interfaces/ichange-active-status';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  public users: IExistingUser[] = [];
  public note = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAllUsers().subscribe({
      next: (usersFromServer) => {
        this.users = usersFromServer;
      },
      error: () => {
        this.note = 'Something went wrong while trying to get all users!';
      },
    });
  }

  changeActiveStatus(user: IExistingUser) {
    const params: IChangeActiveStatus = { username: user.username };
    try {
      this.adminService.changeStatus(params).subscribe({
        next: () => {
          user.isActive = !user.isActive;
        },
        error: () => {
          this.note =
            'Something went wrong while trying to change status of user!';
        },
      });
    } catch (error: any) {
      this.note = error.message;
    }
  }
}

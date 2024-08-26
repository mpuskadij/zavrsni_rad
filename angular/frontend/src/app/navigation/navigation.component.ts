import { CommonModule, NgIf } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive, NgIf],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private router: Router, private ngZone: NgZone) {}
  ngOnInit(): void {
    const sessionStorageData = sessionStorage.getItem('isAdmin');
    if (sessionStorageData === 'true' || sessionStorageData === 'false') {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  logout() {
    sessionStorage.removeItem('isAdmin');
    this.ngZone.run(() => {
      this.router.navigate(['/login']);
    });
  }
}

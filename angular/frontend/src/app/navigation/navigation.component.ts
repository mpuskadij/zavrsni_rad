import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive, NgIf],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    const sessionStorageData = sessionStorage.getItem('isAdmin');
    if (sessionStorageData === 'true' || sessionStorageData === 'false') {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }
}

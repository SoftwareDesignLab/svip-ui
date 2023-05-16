import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private router: Router) {}

  //name: route
  public options: { [route: string]: string } = {
    'Home': '',
    'Manage': 'manage',
    'Analytics': 'analytics'
  };

  Redirect(route: string) {
    this.router.navigate([route]);
  }

  GetOptionKeys(): string[] {
    return Object.keys(this.options);
  }
}

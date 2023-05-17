import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  private options: { [name: string]: any } = {
    "home": {
      route: "/home"
    },
    "manage": {
      desc: "Create, Upload, and Edit SBOMs",
      route: "/manage"
    },
    'analytics': {
      desc: "Compare, View SBOMS, Check Vulnerabilities",
      route: "/analytics"
    }
  }

  constructor(private router: Router) {}

  Redirect(key: string) {
    this.router.navigate([this.options[key].route]);
  }

  GetOptionKeys(): string[] {
    return Object.keys(this.options);
  }

  GetInfo(key: string) {
    return this.options[key];
  }
}

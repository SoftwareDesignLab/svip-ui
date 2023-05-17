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
    'metrics': {
      desc: "Run tests on SBOMs",
      route: "/metrics"
    },
    'compare': {
      desc: "Compare SBOMs to a target",
      route: "/compare"
    },
    'Vulnerabilities': {
      desc: "Check for threats",
      route: "/vulnerabilities"
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

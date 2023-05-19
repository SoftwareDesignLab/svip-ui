import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DataHandlerService } from './data-handler.service';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  private options: { [name: string]: any } = {
    "home": {
      route: "/home",
      requireValidSBOM: 0
    },
    "manage": {
      desc: "Create, Upload, and Edit SBOMs",
      route: "/manage",
      requireValidSBOM: 0
    },
    'metrics': {
      desc: "Run tests on SBOMs",
      route: "/metrics",
      requireValidSBOM: 1
    },
    'compare': {
      desc: "Compare SBOMs to a target",
      route: "/compare",
      requireValidSBOM: 2
    },
    'Vulnerabilities': {
      desc: "Check for threats",
      route: "/vulnerabilities",
      requireValidSBOM: 1
    }
  }

  constructor(private router: Router, public DataHandler: DataHandlerService) {}

  Redirect(key: string) {
    if(this.DataHandler.GetValidSBOMs().length >= this.options[key].requireValidSBOM){
      this.router.navigate([this.options[key].route]);
    }
  }

  GetOptionKeys(): string[] {
    return Object.keys(this.options);
  }

  GetInfo(key: string) {
    return this.options[key];
  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DataHandlerService } from './data-handler.service';

@Injectable({
  providedIn: 'root'
})

export class RoutingService {
  private page: PAGES = PAGES.NONE;
  public data: any;

  GetPage(): PAGES {
    return this.page;
  }

  SetPage(page: PAGES) {
    this.page = page;
  }
}

export enum PAGES {
  NONE = 0,
  VIEW = 1,
  COMPARE = 2
}

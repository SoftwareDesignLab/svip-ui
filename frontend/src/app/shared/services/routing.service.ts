import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DataHandlerService } from './data-handler.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RoutingService {
  private page: PAGES = PAGES.NONE;
  data$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  set data(value: any) {
    this.data$.next(value);
  }
  get data() {
    return this.data$.value;
  }

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

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class AccordionCommunicationService {
  private closeSiblingsSubject = new Subject<number>();

  closeSiblings$ = this.closeSiblingsSubject.asObservable();

  emitCloseSiblings(index: number) {
    this.closeSiblingsSubject.next(index);
  }
}

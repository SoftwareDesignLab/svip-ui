/** @Author Justin Jantzi, Max Stein */

import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AccordionCommunicationService } from './accordion-communication.service';
import { NgbAccordion, NgbPanel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['../components.css']
})
export class AccordionComponent {
  @Input() title: string = '';
  @Input() extra: string[] = [];
  @Input() color: string = '';

  @ViewChild('accordion', { static: false }) accordion?: NgbAccordion;

  constructor(private elementRef: ElementRef, private broadcast: AccordionCommunicationService) {
    this.broadcast.closeSiblings$.subscribe((index: number) => {
      
      console.log(this.accordion)

      if(!this.accordion)
        return;

      const element = this.elementRef.nativeElement as HTMLElement;

      if(this.calculateDepth(element) === index) {
        console.log(this.accordion);
        this.accordion.collapse('0');
      }
    });
  }

  calculateDepth(node: HTMLElement): number {
    let depth = 0;
  
    while (node.parentNode) {
      depth++;
      node = node.parentNode as HTMLElement;
    }
  
    return depth;
  }

  emitClose() {
    const element = this.elementRef.nativeElement as HTMLElement;
    let index = this.calculateDepth(element);
    this.broadcast.emitCloseSiblings(index);
  }
}

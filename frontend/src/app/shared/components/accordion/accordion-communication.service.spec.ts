import { TestBed } from '@angular/core/testing';

import { AccordionCommunicationService } from './accordion-communication.service';

describe('AccordionCommunicationService', () => {
  let service: AccordionCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccordionCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

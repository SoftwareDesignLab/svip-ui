import { Component, Input } from '@angular/core';
import { DataHandlerService } from '../../services/data-handler.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent {
  constructor(private handler: DataHandlerService, public modalService: NgbModal){}
  @Input() item: any = null;

  open(content: any): NgbModalRef {
    return this.modalService.open(content);
  }
}

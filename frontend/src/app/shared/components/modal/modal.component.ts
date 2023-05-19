import { Component } from '@angular/core';
import { DataHandlerService } from '../../services/data-handler.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  constructor( private dataHandler: DataHandlerService, private modalService: NgbModal
    ) {}

 /**
   * Opens modal
   * @param content template reference
   */
  open(content: any) {
    this.modalService.open(content);
  }
}

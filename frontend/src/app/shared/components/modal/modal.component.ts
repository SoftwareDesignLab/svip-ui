/** @Author Justin Jantzi */

import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent {
  @Input() opened: boolean = false;
  @Output() close = new EventEmitter<Boolean>();

  /**
   * Closes the modal
   */
  Close() {
    this.close.emit(true);
  }
}

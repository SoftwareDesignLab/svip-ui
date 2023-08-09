import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-repair-modal',
  templateUrl: './repair-modal.component.html',
  styleUrls: ['./repair-modal.component.css']
})
export class RepairModalComponent {

  @Input() opened!: boolean;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  Close() {
    this.close.emit(false);
  }

  Repair() {
    this.close.emit(false);
  }

}

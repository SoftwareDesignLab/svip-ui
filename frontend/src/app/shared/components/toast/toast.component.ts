import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  @Input() opened: boolean = false;
  @Output() close = new EventEmitter<Boolean>();

  Close() {
    this.close.emit(true);
  }

}

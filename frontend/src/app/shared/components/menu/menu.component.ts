import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  @Input() opened: boolean = false;
  @Output() close = new EventEmitter<Boolean>();

  Close() {
    this.close.emit(true);
  }
  
}

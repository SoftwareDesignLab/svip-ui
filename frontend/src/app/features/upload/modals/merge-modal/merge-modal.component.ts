import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-merge-modal',
  templateUrl: './merge-modal.component.html',
  styleUrls: ['./merge-modal.component.css'],
})
export class MergeModalComponent {
  @Input() opened: boolean = false;
  @Output() openedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() set sboms(value: string[]) {
    this._sboms = value;
  }
  get sboms() {
    return this._sboms;
  }

  private _sboms: string[] = [];

  constructor() {}

  close() {
    this.openedChanged.emit(this.opened);
  }
}

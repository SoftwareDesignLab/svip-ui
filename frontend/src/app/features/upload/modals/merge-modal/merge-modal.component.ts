import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-merge-modal',
  templateUrl: './merge-modal.component.html',
  styleUrls: ['./merge-modal.component.css'],
})
export class MergeModalComponent {
  @Input() open!: boolean;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() set sboms(value: string[]) {
    if (!this.open) return;
    this._sboms = value;
  }
  get sboms() {
    return this._sboms;
  }

  private _sboms: string[] = [];

  constructor() {}

  close() {
    this.openChange.emit(false);
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SVIPService } from 'src/app/shared/services/SVIP.service';

@Component({
  selector: 'app-repair-modal',
  templateUrl: './repair-modal.component.html',
  styleUrls: ['./repair-modal.component.css']
})
export class RepairModalComponent {

  @Input() sbomID: number = 0;
  @Input() opened!: boolean;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() error: any = {};
  selectedFix: any = {};

  constructor(private svipService: SVIPService) {}

  Close() {
    this.close.emit(false);
  }

  Repair() {
    let fix: {[id: number]: any[]} = {};

    fix[this.error.id] = this.error.fixes.filter((x: any) => x.newString === this.selectedFix);
    delete fix[this.error.id][0].new;
    delete fix[this.error.id][0].newString;
    this.svipService.repairSBOM(this.sbomID, fix).then((data: any) => {
      this.close.emit(false);
    })
    
  }

}

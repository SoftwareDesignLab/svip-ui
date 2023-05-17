import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataHandlerService } from 'src/app/shared/services/data-handler.service';
import { Comparison } from '../comparison';

@Component({
  selector: 'app-compare-sidepanel',
  templateUrl: './compare-sidepanel.component.html',
  styleUrls: ['./compare-sidepanel.component.css'],
})
export class CompareSidepanelComponent implements OnInit {
  @Output() compare = new EventEmitter<Comparison>();
  targetSbom: string = '';
  compareSboms: string[] = [];

  constructor(private dataHandler: DataHandlerService) {}

  ngOnInit() {
    this.compareSboms = this.dataHandler.GetValidSBOMs();
  }

  /**
   * Set selected value as target SBOM
   */
  onSelect(event: any) {
    const val = event.target.value;
    this.targetSbom = val;
  }
}

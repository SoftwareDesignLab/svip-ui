import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataHandlerService } from 'src/app/shared/services/data-handler.service';
import { Comparison } from '../comparison';

@Component({
  selector: 'app-compare-sidepanel',
  templateUrl: './compare-sidepanel.component.html',
  styleUrls: ['./compare-sidepanel.component.css'],
})
export class CompareSidepanelComponent implements OnInit {
  @Output() comparison = new EventEmitter<Comparison>();
  targetSbom: string = '';
  compareSboms: string[] = [];
  selectedSboms: string[] = [];

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

  /**
   * Stores or removes sboms based on checkbox
   */
  check(sbom: any) {
    const value = sbom.target.value;
    if (sbom.target.checked) {
      this.selectedSboms.push(value);
    } else {
      this.selectedSboms.indexOf(value);
      this.selectedSboms = this.selectedSboms.filter((sbom) => sbom !== value);
    }
  }
}

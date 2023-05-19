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
    this.targetSbom = this.compareSboms[0];
  }

  /**
   * Select a checkbox
   */
  select(sbom: any) {
    this.targetSbom = sbom.target.value;
  }

  /**
   * Stores or removes sboms based on checkbox
   */
  check(sbom: any) {
    const value = sbom.target.value;
    if (sbom.target.checked) {
      this.selectedSboms.push(value);
    } else {
      this.selectedSboms = this.selectedSboms.filter((sbom) => sbom !== value);
    }
  }

  /**
   * Checks if all valid SBOMS are selected
   */
  areAllSelected() {
    const length = this.compareSboms.length + (this.targetSbom ? -1 : 0);
    return this.selectedSboms.length === length;
  }

  /**
   * Selects all sboms
   */
  selectAll() {
    if (this.areAllSelected()) {
      this.selectedSboms = [];
    } else {
      this.selectedSboms = this.compareSboms.filter(
        (sbom) => sbom !== this.targetSbom
      );
    }
  }

  /**
   * Get SBOM filename
   */
  getAlias(sbom: string) {
    return this.dataHandler.getSBOMAlias(sbom);
  }

  IsLoadingComparison(): boolean {
    return this.dataHandler.IsLoadingComparison();
  }

  async compare() {
    if (!this.targetSbom) return;

    if (this.IsLoadingComparison()) return;
    const res = await this.dataHandler.Compare(
      this.targetSbom,
      this.selectedSboms
    );
    this.comparison.emit(res);
  }
}

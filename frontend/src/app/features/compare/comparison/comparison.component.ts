import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Comparison, ComponentVersion, Identifier } from '../comparison';
import { DataHandlerService } from 'src/app/shared/services/data-handler.service';
@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css'],
})
export class ComparisonComponent {
  comparison: Comparison | undefined;
  path: string[] = ['Components'];
  version: ComponentVersion | undefined;
  attributes: Identifier[] = [
    Identifier.swids,
    Identifier.cpes,
    Identifier.purls,
  ];

  get compare() {
    return this.comparison?.comparisons ? this.comparison.comparisons : {};
  }

  constructor(private dataHandler: DataHandlerService) {}

  decreaseDepth(newLoc: string) {
    const index = this.path.indexOf(newLoc);
    this.path = this.path.slice(0, index + 1);
    // component -> component version
    if (this.path.length < 2) {
      this.version = undefined;
    }
  }

  getComponents() {
    if (!this.comparison) return;
    return Object.keys(this.comparison?.comparisons);
  }

  getComparisonFiles() {
    return this.dataHandler.lastSentFilePaths;
  }

  getKeys(obj: object) {
    return Object.keys(obj);
  }

  passed(num: number) {
    return num < this.getComparisonFiles().length ? `--red` : `--green`;
  }

  getAttributes(attribute: Identifier) {
    if (this.version) {
      return this.version[attribute];
    }
    return {};
  }

  IsLoadingComparison(): boolean {
    return this.dataHandler.IsLoadingComparison();
  }

  getComparison() {
    if (this.comparison !== this.dataHandler.comparison) {
      this.path = ['Components'];
    }
    this.comparison = this.dataHandler.comparison;
    return this.dataHandler.comparison;
  }
}

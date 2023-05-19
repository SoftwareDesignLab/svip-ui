import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Comparison, ComponentVersion, Attributes } from '../comparison';
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
  readonly attributes: ['cpes', 'purls', 'swids'] = ['cpes', 'purls', 'swids']; // Typescript work around

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
    console.log(this.comparison);
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

  getAttributes(index: 0 | 1 | 2) {
    if (this.version) {
      return this.version[this.attributes[index]];
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

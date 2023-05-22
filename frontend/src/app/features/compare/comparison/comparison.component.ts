import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Attribute,
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
  targetSBOM: any = {};
  filtered = false;
  markTarget = false;

  get compare() {
    return this.comparison?.comparisons ? this.comparison.comparisons : {};
  }

  get components() {
    return !this.comparison ? [] : Object.keys(this.comparison?.comparisons);
  }

  get lastSentFilePaths() {
    return this.dataHandler.lastSentFilePaths;
  }

  get isLoadingComparison(): boolean {
    return this.dataHandler.IsLoadingComparison();
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

  getComparison() {
    if (this.comparison !== this.dataHandler.comparison) {
      this.path = ['Components'];
    }
    this.comparison = this.dataHandler.comparison;
    return this.dataHandler.comparison;
  }

  getAliasFromIndex(index: any) {
    let path = this.dataHandler.lastSentFilePaths[index];
    return this.dataHandler.getSBOMAlias(path);
  }

  getAttributes(attribute: Identifier) {
    if (this.version) {
      return Object.keys(this.version[attribute]);
    }
    return [];
  }

  isInTarget(val: { component?: string; version?: string; value?: string }) {
    if (val.component) {
      if (val.version) {
        if (val.value) {
          return !!this.targetSBOM[val.component][val.version][val.value];
        }
        return !!this.targetSBOM[val.component][val.version];
      }
      !!this.targetSBOM[val.component];
    }
    return false;
  }

  getTargetSBOMValues() {
    if (!this.comparison?.targetSBOM) {
      return;
    }
    const targetSBOM = this.comparison.targetSBOM;

    targetSBOM.allComponents?.forEach((component) => {
      if (component.name) {
        if (!this.targetSBOM[component.name]) {
          this.targetSBOM[component.name] = [];
        }
        if (component.version) {
          this.targetSBOM[component.name].push(component.version);
        }
      }
    });
  }

  //#region Filters

  /**
  * Checks to see if 
  */
  passed(num: number) {
    return num < this.lastSentFilePaths.length ? `--red` : `--green`;
  }

  componentHasConflict(component: string) {
    let isConflict = false;
    this.compare[component].forEach((version) => {
      if (version) {
        // First check CPES for unique values
        this.attributes.forEach((attr) => {
          const ids = Object.keys(version[attr]);
          ids.forEach((id) => {
            if (this.hasConflict(version[attr][id].appearances?.length)) {
              isConflict = true;
            }
          });
        });

        if (this.hasConflict(version.appearances.length)) {
          isConflict = true;
        }
      }
    });
    return isConflict;
  }

  hasConflict(appearances: number) {
    if (!this.filtered) return true;
    return appearances < this.dataHandler.lastSentFilePaths.length;
  }
  //#endregion
}

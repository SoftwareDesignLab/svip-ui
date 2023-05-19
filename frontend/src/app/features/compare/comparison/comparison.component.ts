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
    let inTarget = false;
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

    // targetSBOM[pathTitles[1]] && targetMarked
    //   ? targetSBOM[pathTitles[1]].indexOf(version.componentVersion) !== -1
    //     ? '*'
    //     : ''
    //   : '';

    // value.appearances && targetMarked
    //   ? value.appearances.indexOf(0) !== -1
    //     ? '*'
    //     : ''
    //   : '';
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
}

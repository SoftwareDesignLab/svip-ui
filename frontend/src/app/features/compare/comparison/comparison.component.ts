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

  /**
   * Gets comparison results
   */
  get compare() {
    return this.comparison?.comparisons ? this.comparison.comparisons : {};
  }

  /**
   * Gets comparison components
   */
  get components() {
    return !this.comparison ? [] : Object.keys(this.comparison?.comparisons);
  }

  /**
   * Gets last sent files
   */
  get lastSentFilePaths() {
    return this.dataHandler.lastSentFilePaths;
  }

  /**
   * Gets if comparison is still loading
   */
  get isLoadingComparison(): boolean {
    return this.dataHandler.IsLoadingComparison();
  }

  constructor(private dataHandler: DataHandlerService) {}

  /**
   * Changes location based on where user wants to navigate to
   * @param newLoc - desired location
   */
  decreaseDepth(newLoc: string) {
    const index = this.path.indexOf(newLoc);
    this.path = this.path.slice(0, index + 1);
    // component -> component version
    if (this.path.length < 2) {
      this.version = undefined;
    }
  }

  /**
   * Gets comparison results
   * @returns comparison
   */
  getComparison() {
    if (this.comparison !== this.dataHandler.comparison) {
      this.path = ['Components'];
    }
    this.comparison = this.dataHandler.comparison;
    return this.dataHandler.comparison;
  }

  /**
   * Gets specified SBOM from last send index
   * @param index - index of SBOM
   * @returns name of SBOM from index
   */
  getAliasFromIndex(index: any) {
    let path = this.dataHandler.lastSentFilePaths[index];
    return this.dataHandler.getSBOMAlias(path);
  }

  /**
   * Gets vulnerability formats (cpes, swids, purls, etc)
   * @param Identifier - type of format
   * @returns all of currently selected version's format values
   */
  getAttributes(attribute: Identifier) {
    if (this.version) {
      return Object.keys(this.version[attribute]);
    }
    return [];
  }

  /**
   * Checks to see if value is in target sbom
   * @param value - location and value to check in targetSBOM
   * @returns true if value is in target; else false
   */
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

  /**
   * Formats target SBOM
   */
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
   * Checks to see if number is equal to the number of total comparison files
   * @param num - number to check against comparison file count
   * @returns var(--red) if comparison has conflicts, var(--green) if success
   */
  passed(num: number) {
    return num < this.lastSentFilePaths.length ? `var(--red)` : `var(--green)`;
  }

  /**
   * Checks to see if component has a conflict
   * @param component - name of component to check
   * @returns true if conflict; else false
   */
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

  /**
   *  Checks if there is a component conflict with other files
   *  @returns true if conflict; else false
   */
  hasConflict(appearances: number) {
    if (!this.filtered) return true;
    return appearances < this.dataHandler.lastSentFilePaths.length;
  }
  //#endregion
}

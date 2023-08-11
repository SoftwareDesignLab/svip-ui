import { Component } from '@angular/core';
import { SbomService } from 'src/app/shared/services/sbom.service';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css']
})
export class ComparisonComponent {

  constructor(public sbomService: SbomService) { }

  GetComparison() {
    return this.sbomService.comparison;
  }

  protected castToString(value: unknown): string {
    return value as string;
  }

  protected formatValue(value: any): string {
    const formattedValue = JSON.stringify(value, null, 2);
    const replacedValue = formattedValue.replace(/[[\]{},"]/g, '');

    const capitalizeFirstLetter = (word: string) => {
        return word.replace(/(\w*)'(\w*)/g, (_, beforeApostrophe, afterApostrophe) => {
            return beforeApostrophe.toLowerCase() + "'" + afterApostrophe.toLowerCase();
        });
    };

    const modifiedValue = replacedValue.replace(/_/g, ' ').replace(/\b\w+\b/g, capitalizeFirstLetter);

    return modifiedValue + '\n';
  }

  protected castAsAny(value: unknown): any {
    return value as any;
  }
}

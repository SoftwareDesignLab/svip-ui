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
    return formattedValue.replace(/[[\]{},"]/g, '') + '\n';
  }

  protected castAsAny(value: unknown): any {
    return value as any;
  }
}

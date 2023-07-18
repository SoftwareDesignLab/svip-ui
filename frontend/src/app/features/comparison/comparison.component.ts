import { Component } from '@angular/core';
import { DataHandlerService } from 'src/app/shared/services/data-handler.service';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css']
})
export class ComparisonComponent {

  constructor(public dataHandler: DataHandlerService) { }

  GetComparison() {
    return this.dataHandler.comparison;
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
import { Component } from '@angular/core';
import { VexResponse } from 'src/app/shared/models/vex';
import { SVIPService } from 'src/app/shared/services/SVIP.service';
import { RoutingService } from 'src/app/shared/services/routing.service';

@Component({
  selector: 'app-vex',
  templateUrl: './vex.component.html',
  styleUrls: ['./vex.component.css']
})
export class VexComponent {
  protected vex: VexResponse | undefined;
  protected loading: boolean = false;

  constructor(private client: SVIPService, private routing: RoutingService) {}

  protected vexOptions = {
    databases: ['OSV', 'NVD'],
    formats: ['CycloneDX', 'CSAF'],
    requiresAPIKey: ['NVD'],
    selectedDatabase: '',
    selectedFormat: '',
    apiKey: '',
  }

  protected vexObjectList = ['status', 'products', 'vulnerability'];

  protected castAsAny(value: unknown): any {
    return value as any;
  }

  protected formatValue(input: any): string {
    if (Array.isArray(input)) {
      const formattedString = input.map(obj =>
        Object.entries(obj)
          .map(([key, value]) => (value ? `${key}: ${value}` : ''))
          .filter(str => str !== '')
          .join('<br>')
      ).join('<br>');
      return formattedString;
    } else if (typeof input === 'object' && input !== null) {
      const formattedString = Object.entries(input)
        .map(([key, value]) => (value ? `${key}: ${value}` : ''))
        .filter(str => str !== '')
        .join('<br>');
      return formattedString;
    } else {
      return input.toString();
    }
  }

  protected removeStatements(value: any) {
    const copy = { ...value };
    delete copy.vexstatements;
    return [copy];
  }

  GenerateData() {

    this.vex = undefined;
    this.loading = true;

    if(this.vexOptions.selectedDatabase === '' || this.vexOptions.selectedFormat === '')
      return;

    if(this.vexOptions.requiresAPIKey.includes(this.vexOptions.selectedDatabase) && this.vexOptions.apiKey === '')
      return;

    this.client.getVex(this.routing.data, this.vexOptions.selectedFormat, this.vexOptions.selectedDatabase).subscribe((result) => {
      if(result) {
        this.vex = result;
      }

      this.loading = false;
    })
  }
}

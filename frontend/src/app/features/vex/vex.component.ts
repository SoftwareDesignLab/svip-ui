import { Component } from '@angular/core';
import { VexResponse } from 'src/app/shared/models/vex';

@Component({
  selector: 'app-vex',
  templateUrl: './vex.component.html',
  styleUrls: ['./vex.component.css']
})
export class VexComponent {
  protected vex: VexResponse | undefined;

  protected vexOptions = {
    databases: ['osv', 'nvd'],
    formats: ['cyclonedx', 'csaf'],
    requiresAPIKey: ['nvd'],
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
}

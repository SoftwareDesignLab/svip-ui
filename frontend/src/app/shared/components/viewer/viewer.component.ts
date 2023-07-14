import { Component } from '@angular/core';
import { RoutingService } from '../../services/routing.service';
import { DataHandlerService } from '../../services/data-handler.service';
import { data } from '../../models/mockMeta';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent {
  files: File[] = [];
  pretty: boolean = true;
  data = data;

  constructor(public routing: RoutingService, public dataHandler: DataHandlerService) {
  }

  /**
   * Get SBOM filename
   */
  getAlias(sbom: string) {
    return this.dataHandler.getSBOMAlias(sbom);
  }

  isObjectType(value: any): boolean {
    return typeof value === 'object' && !Array.isArray(value);
  }

  isStringOrArray(value: any): boolean {
    return typeof value === 'string' || Array.isArray(value) || (typeof value === 'object' && value !== null);
  }

  convertToString(value: any): string {
    if (typeof value === 'string') {
      return value;
    } else if (Array.isArray(value)) {
      return value.join(', ');
    } else {
      return '';
    }
  }

  formatValue(value: any): string {
    const formattedValue = JSON.stringify(value, null, 2);
    return formattedValue.replace(/[[\]{},"]/g, '') + '\n';
  }

}

import { Component, Input } from '@angular/core';
import { RoutingService } from '../../services/routing.service';
import { DataHandlerService } from '../../services/data-handler.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css'],
})
export class ViewerComponent {
  files: File[] = [];
  pretty: boolean = true;
  data: any;;
  raw: string = '';
  @Input() components: any[] | undefined;

  constructor(
    public routing: RoutingService,
    public dataHandler: DataHandlerService
  ) {
    routing.data$.subscribe((data) => {
      this.data = data;
      if (data) {
        const sbomData = dataHandler.GetSBOMInfo(data);
        if (sbomData.id) {
          this.dataHandler.getSBOM(sbomData.id).subscribe(sbom => {
            this.data = sbom;
          })
        }
      }
    });
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
    return (
      typeof value === 'string' ||
      Array.isArray(value) ||
      (typeof value === 'object' && value !== null)
    );
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

  getContents(path: string) {
    return this.dataHandler.GetSBOMInfo(path).contents;
  }
}

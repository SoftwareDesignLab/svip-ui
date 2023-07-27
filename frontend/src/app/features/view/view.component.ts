import { Component, Input } from '@angular/core';
import { PAGES, RoutingService } from '../../shared/services/routing.service';
import { SbomService } from '../../shared/services/sbom.service';
import { SVIPService } from '../../shared/services/SVIP.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent {
  files: File[] = [];
  pretty: boolean = true;
  data: any;;
  raw: string = '';
  title: string = '';
  @Input() components: any[] | undefined;

  constructor(
    private routing: RoutingService,
    public sbomService: SbomService,
    private svipService: SVIPService
  ) {
    routing.data$.subscribe((data) => {
      if (routing.GetPage() === PAGES.VIEW) {
      this.title = data;
      this.data = data;
      if (data) {
        const sbomData = sbomService.GetSBOMInfo(data);
        if (sbomData.id) {
          this.svipService.getSBOM(sbomData.id).subscribe(sbom => {
            this.data = sbom;
          })
        }
      }
      }
    });
  }

  /**
   * Get SBOM filename
   */
  getAlias(sbom: string) {
    return this.sbomService.getSBOMAlias(sbom);
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
    return this.sbomService.GetSBOMInfo(path).contents;
  }
}

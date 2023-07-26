import { Component, Input, OnInit, } from '@angular/core';
import { SVIPService } from 'src/app/shared/services/SVIP.service';
import { RoutingService } from 'src/app/shared/services/routing.service';
import { SbomService } from 'src/app/shared/services/sbom.service';
import palettes, { PALETTES } from './palettes';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css'],
})
export class MetricsComponent implements OnInit {
  qa: any = null;
  components: { [componentName: string]: string[] } = {};
  attributes: { [ProcessorName: string]: { color: string; shown: boolean } } =
    {};
  name: string = '';
  palettes = palettes;
  palette: PALETTES = PALETTES.DEFAULT;

  constructor(
    private routing: RoutingService,
    SVIP: SVIPService,
    sbomService: SbomService
  ) {
    routing.data$.subscribe((data) => {
      if (data) {
        this.name = data;
        const sbom = sbomService.GetSBOMInfo(data);
        SVIP.gradeSBOM(sbom.id).subscribe((qa) => {
          if (qa) {
            this.qa = qa;
            this.getKeys();
            this.setColor();
          }
        });
      }
    });
  }

  ngOnInit() {}

  getKeys() {
    // Components
    Object.keys(this.qa.components).forEach((component) => {
      const componentTestNames = Object.keys(this.qa.components[component]);
      this.components[component] = componentTestNames;
      // Component tests
      this.components[component].forEach((test: any) => {
        // test results
        this.getTestResults(component, test).forEach((testResult) => {
          const processors = testResult.attributes as string[];
          // Processors/Attributes
          processors.forEach((processor: string) => {
            this.attributes[processor] = { shown: true, color: '' };
          });
        });
      });
    });
  }

  isFiltered(testResult: any) {
    return !!testResult.attributes.filter(
      (attr: string) => this.attributes[attr].shown
    ).length;
  }

  getTestResults(component: string, test: string): any[] {
    return this.qa.components[component][test];
  }

  setColor() {
    Object.keys(this.attributes).forEach((attr, index) => {
      this.attributes[attr].color = this.palettes[this.palette][index];
    });
  }
}

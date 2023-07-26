import { Component, Input, OnInit } from '@angular/core';
import { SVIPService } from 'src/app/shared/services/SVIP.service';
import { RoutingService } from 'src/app/shared/services/routing.service';
import { SbomService } from 'src/app/shared/services/sbom.service';
import palettes, { PALETTE, resultStatus } from '../models/palette';
import filter from '../models/filters';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css'],
})
export class MetricsComponent implements OnInit {
  qa: any = null;
  components: { [componentName: string]: testResult[] } = {};
  attributes: filter = {};
  name: string = '';
  palettes = palettes;
  private _palette = PALETTE.DEFAULT;
  get palette() {
    return this._palette;
  }
  set palette(value: PALETTE) {
    this._palette = value;
    this.setColor();
  }

  resultStatus: resultStatus = {
    PASS: { shown: true, color: 'var(--success)' },
    FAIL: { shown: true, color: 'var(--warn)' },
  };

  constructor(
    private routing: RoutingService,
    private SVIP: SVIPService,
    private sbomService: SbomService
  ) {
    routing.data$.subscribe((data) => {
      if (data) {
        this.name = data;
        const sbom = sbomService.GetSBOMInfo(data);
        SVIP.gradeSBOM(sbom.id).subscribe((qa) => {
          if (qa) {
            this.qa = qa;
            this.getKeys();
          }
        });
      }
    });
  }

  ngOnInit() {}

  getKeys() {
    // Components
    Object.keys(this.qa.components).forEach((component) => {
      this.components[component] = [];
      const componentTestNames = Object.keys(this.qa.components[component]);
      const tests = componentTestNames;
      // Component tests
      tests.forEach((test: any) => {
        // test results
        this.qa.components[component][test].forEach((testResult: any) => {
          this.components[component].push(testResult);
          if (testResult.status !== 'ERROR') {
            const processors = testResult.attributes as string[];
            // Processors/Attributes
            processors.forEach((processor: string) => {
              this.attributes[processor] = { shown: true, color: '' };
            });
          }
        });
      });
    });
    this.setColor();
  }

  getTestResults(component: string): any[] {
    return this.components[component]
      .filter((result) => this.isFiltered(result))
      .sort((a, b) => (a.status > b.status ? 1 : -1));
  }

  isFiltered(testResult: any) {
    return (
      this.resultStatus[testResult.status].shown &&
      testResult.attributes.filter(
        (attr: string) => this.attributes[attr].shown
      ).length
    );
  }

  setColor() {
    Object.keys(this.attributes).forEach((attr, index) => {
      this.attributes[attr].color = this.palettes[this.palette][index];
    });
  }
}

interface testResult {
  attributes: string[];
  test: string;
  message: string;
  details: string;
  status: string;
}

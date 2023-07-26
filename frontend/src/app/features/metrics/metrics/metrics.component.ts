import { Component, Input, OnInit } from '@angular/core';
import { SVIPService } from 'src/app/shared/services/SVIP.service';
import { RoutingService } from 'src/app/shared/services/routing.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css'],
})
export class MetricsComponent implements OnInit {
  qa: any = null;
  componentNames: string[] = [];
  components: { [componentName: string]: string[] } = {};
  attributes: { [ProcessorName: string]: { color: string; shown: boolean } } =
    {};
  attributeNames: string[] = [];
  palettes: { [key: string]: string[] } = {
    default: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'],
    wong: [
      '#000000',
      '#E69F00',
      '#56B4E9',
      '#009E73',
      '#F0E442',
      '#0072B2',
      '#D55E00',
      '#CC79A7',
    ],
  };
  selectedPalette = 'default';
  accessibilityModal = false;

  constructor(private routing: RoutingService, SVIP: SVIPService) {
    routing.data$.subscribe((data) => {
      if (data) {
        SVIP.gradeSBOM(data.id).subscribe((qa) => {
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
    this.componentNames = Object.keys(this.qa.components);
    // Components
    this.componentNames.forEach((component) => {
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
    this.attributeNames = Object.keys(this.attributes);
  }

  isFiltered(testResult: any) {
    return !!testResult.attributes.filter(
      (attr: string) => this.attributes[attr].shown
    ).length;
  }

  getTestResults(component: string, test: string): any[] {
    return this.qa.components[component][test];
  }

  log(text: string) {
    console.log(text);
  }

  setColor() {
    Object.keys(this.attributes).forEach((attr, index) => {
      this.attributes[attr].color = this.palettes[this.selectedPalette][index];
      console.log(this.attributes[attr].color);
    });
  }
}

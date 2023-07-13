import { Component, Input, OnInit } from '@angular/core';
import qualityReport from '../qa';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css'],
})
export class MetricsComponent implements OnInit {
  qa: any = null;
  componentNames: string[] = [];
  components: { [componentName: string]: string[] } = {};
  attributes: { [ProcessorName: string]: boolean } = {};
  attributeNames: string[] = [];

  _sbom: any = null;

  @Input() set sbom(sbom: any) {
    this.qa = qualityReport;
    this._sbom = { name: this.qa.fileName };
    this.getKeys();
  }
  get sbom() {
    return this._sbom;
  }

  constructor() {}

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
          const processors = testResult.attribute as string[];
          // Processors/Attributes
          processors.forEach(
            (processor: string) => (this.attributes[processor] = true)
          );
        });
      });
    });
    this.attributeNames = Object.keys(this.attributes);
  }

  isFiltered(testResult: any) {
    return !!testResult.attribute.filter((attr: string) =>  this.attributes[attr]).length;
  }

  getTestResults(component: string, test: string): any[] {
    return this.qa.components[component][test];
  }

  log(text: string) {
    console.log(text);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import qualityReport from './qa';

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
      this.log('component tests')
      this.components[component].forEach((test: any) => {
      this.log(`test: ${test}`);
        // test results
        this.log('test result')
        this.getTestResults(component, test).forEach((testResult) => {
        this.log(`result: ${testResult}`);
        this.log(testResult);
          const processors = testResult.attributes as string[];
          processors.forEach(
            (processor: string) => (this.attributes[processor] = true)
          );
        });
      });
    });
    this.attributeNames = Object.keys(this.attributes);
  }

  getTestResults(component: string, test: string): any[] {
    return this.qa.components[component][test];
  }

  log(text: string) {
    console.log(text);
  }
}
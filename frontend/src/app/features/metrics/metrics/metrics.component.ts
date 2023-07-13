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
  attributes: { [ProcessorName: string]: { color: string; shown: boolean } } =
    {};
  attributeNames: string[] = [];
  _sbom: any = null;
  colors: string[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];

  // TODO: why did i make an arrays of names... I could've just used entries/key value in html

  @Input() set sbom(sbom: any) {
    this.qa = qualityReport;
    this._sbom = { name: this.qa.fileName };
    this.getKeys();
    this.setColor();
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
          const processors = testResult.attributes as string[];
          // Processors/Attributes
          processors.forEach((processor: string) => {
            this.attributes[processor] = {shown: true, color: ''}
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
      this.attributes[attr].color = this.colors[index]
    });
  }
}

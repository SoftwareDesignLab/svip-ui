import { Component, Input, OnInit } from '@angular/core';
import qualityReport from './qa';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css'],
})
export class MetricsComponent implements OnInit {
  qa: any = null;
  components: string[] = [];
  attributes: {[key: string]: boolean } = {};
  attributeNames: string[] = [];

  _sbom: any = null;

  @Input() set sbom(sbom: any) {
    this.qa = qualityReport;
    this.getKeys();
    this._sbom = {name: 'SBOM A'};
  }
  get sbom() {
    return this._sbom;
  }

  constructor() {}

  ngOnInit() {}

  getKeys() {
    this.components = Object.keys(this.qa.components);
    this.components.forEach((component) => {
      this.qa.components[component].forEach((test: any) => {
        if (test) {
          const processors = test.attributes as string[];
          processors.forEach((processor: string) => this.attributes[processor] = true );
        }
      });
    });
    this.attributeNames = Object.keys(this.attributes);
  }
}

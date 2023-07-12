import { Component, Input, OnInit } from '@angular/core';
import qualityReport from './qa';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css'],
})
export class MetricsComponent implements OnInit {
  qa: any = null;
  components: string[] = [];
  attributes: string[] = [];
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
    const attributes = new Set<string>();
    this.components.forEach((component) => {
      this.qa.components[component].forEach((test: any) => {
        if (test) {
          const processors = test.attributes as string[];
          processors.forEach((processor: any) => attributes.add(processor));
        }
      });
    });
    this.attributes = Array.from(attributes);
  }
}

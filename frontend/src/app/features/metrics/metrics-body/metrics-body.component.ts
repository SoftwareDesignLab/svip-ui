import { Component, Input } from '@angular/core';
import { qualityReport } from '../qualityReport';
import { DataHandlerService } from 'src/app/shared/services/data-handler.service';

@Component({
  selector: 'app-metrics-body',
  templateUrl: './metrics-body.component.html',
  styleUrls: ['./metrics-body.component.css']
})
export class MetricsBodyComponent {
  constructor(private handler: DataHandlerService) {}

  //TODO: convert to input
  GetQualityReport(): any {
    if(!this.handler.selectedQualityReport)
      return null;

    return this.handler.metrics[this.handler.selectedQualityReport];
  }

  getPassedPercent(testResult: any) {
    return (testResult.successfulTests / testResult.tests.length * 100).toFixed(2);
  }
}

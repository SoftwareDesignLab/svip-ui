import { Component } from '@angular/core';
import { DataHandlerService } from 'src/app/shared/services/data-handler.service';

@Component({
  selector: 'app-metrics-side-panel',
  templateUrl: './metrics-side-panel.component.html',
  styleUrls: ['./metrics-side-panel.component.css']
})
export class MetricsSidePanelComponent {

  constructor(private handler: DataHandlerService) {}

  GetSBOMs() {
    return this.handler.GetValidSBOMs();
  }

  SetSelectedSBOM(bom: string) {
    this.handler.selectedQualityReport = bom;
  }
}

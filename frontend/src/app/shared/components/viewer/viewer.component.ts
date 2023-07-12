import { Component } from '@angular/core';
import { RoutingService } from '../../services/routing.service';
import { DataHandlerService } from '../../services/data-handler.service';
import { data } from '../../models/mockMeta';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent {
  files: File[] = [];
  pretty: boolean = false;
  data = data;

  constructor(public routing: RoutingService, public dataHandler: DataHandlerService) {
  }

  /**
   * Get SBOM filename
   */
  getAlias(sbom: string) {
    return this.dataHandler.getSBOMAlias(sbom);
  }
}

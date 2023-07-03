import { Component } from '@angular/core';
import { RoutingService } from '../../services/routing.service';
import { DataHandlerService } from '../../services/data-handler.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent {
  files: File[] = [];
  pretty: boolean = false;

  constructor(public routing: RoutingService, public dataHandler: DataHandlerService) {

  }
}

import { Component } from '@angular/core';
import { RoutingService } from '../../services/routing.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent {
  files: File[] = [];
  pretty: boolean = false;

  constructor(public routing: RoutingService) {

  }
}

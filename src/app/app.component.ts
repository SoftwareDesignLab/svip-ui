import { Component } from '@angular/core';
import { RoutingService } from './shared/services/routing.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  constructor(public routing: RoutingService) {}
}

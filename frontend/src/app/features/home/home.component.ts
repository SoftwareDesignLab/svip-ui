import { Component } from '@angular/core';
import { RoutingService } from 'src/app/shared/services/routing.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

    constructor(public routing: RoutingService) {}
}

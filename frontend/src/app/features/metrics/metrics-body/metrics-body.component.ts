import { Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/shared/services/routing.service';

@Component({
  selector: 'app-metrics-body',
  templateUrl: './metrics-body.component.html',
  styleUrls: ['./metrics-body.component.css']
})
export class MetricsBodyComponent implements OnInit {
  title: string = '';
  constructor(private routing: RoutingService) {
    this.title = routing.data.fileName;
  }

  ngOnInit() {
  }

}

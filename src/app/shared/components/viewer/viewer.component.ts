import { Component, Input } from '@angular/core';
import { RoutingService } from '../../services/routing.service';

@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.css'],
    standalone: false
})
export class ViewerComponent {
  constructor(private routingService: RoutingService) {}

  @Input() title: string = '';
  @Input() subTitle: string = '';
  @Input() options: string[] = [];
  @Input() selectedOption: string = '';

  close() {
    return this.routingService.SetPage(0);
  }
}

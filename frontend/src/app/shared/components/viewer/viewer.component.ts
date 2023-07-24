import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent {
  @Input() title: string = '';
  @Input() subTitle: string = '';
  @Input() options: string[] = [];
  @Input() selectedOption: string = '';
}

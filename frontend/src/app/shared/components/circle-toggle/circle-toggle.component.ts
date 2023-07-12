import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-circle-toggle',
  templateUrl: './circle-toggle.component.html',
  styleUrls: ['../components.css'],
})
export class CircleToggleComponent implements OnInit {
  @Input() color = 'red';
  @Input() toggle = true;

  constructor() {}

  ngOnInit() {}

  toggleStyle() {
    let style: { [key: string]: any } = {};
    const property = this.toggle ? 'background-color' : 'border';
    const value = this.toggle ? this.color : `1px solid ${this.color}`;
    style[property] = value;
    return style;
  }
}

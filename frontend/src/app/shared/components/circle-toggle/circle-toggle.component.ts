import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-circle-toggle',
  templateUrl: './circle-toggle.component.html',
  styleUrls: ['../components.css']
})
export class CircleToggleComponent implements OnInit {
  @Input() color = 'red';
  @Input() toggle = true;


  constructor() { }

  ngOnInit() {
  }

  toggleStyle(){
    let style: {[key: string]: any} = {};
    const property = this.toggle ? 'background-color' : 'border'
    style[property] = this.toggle ? `1px solid ${this.color}` : this.color;
    console.log(JSON.stringify(style));
    return style;
  }
}

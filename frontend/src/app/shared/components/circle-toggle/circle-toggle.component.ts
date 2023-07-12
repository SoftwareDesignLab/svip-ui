import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-circle-toggle',
  templateUrl: './circle-toggle.component.html',
  styleUrls: ['../components.css']
})
export class CircleToggleComponent implements OnInit {
  @Input() color = 'Red';
  @Input() toggle = true;


  constructor() { }

  ngOnInit() {
  }

}

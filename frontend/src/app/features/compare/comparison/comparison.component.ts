import { Component, OnInit, Input } from '@angular/core';
import { Comparison } from '../comparison';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css']
})
export class ComparisonComponent implements OnInit {
  @Input() comparison! : Comparison

  constructor() { }

  ngOnInit() {
  }

}

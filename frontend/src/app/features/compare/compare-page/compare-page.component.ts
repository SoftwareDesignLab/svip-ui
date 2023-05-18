import { Component, OnInit } from '@angular/core';
import { Comparison } from '../comparison';

@Component({
  selector: 'app-compare-page',
  templateUrl: './compare-page.component.html',
  styleUrls: ['./compare-page.component.css']
})
export class ComparePageComponent implements OnInit {
  comparison: Comparison | null= null;

  constructor() { }

  ngOnInit() {
  }

}

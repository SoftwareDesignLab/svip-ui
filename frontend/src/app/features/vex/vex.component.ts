import { Component } from '@angular/core';
import { VexResponse } from 'src/app/shared/models/vex';

import mockVex from './mock-vex';

@Component({
  selector: 'app-vex',
  templateUrl: './vex.component.html',
  styleUrls: ['./vex.component.css']
})
export class VexComponent {
  private vex: VexResponse = mockVex;
}

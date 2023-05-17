import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataHandlerService } from 'src/app/shared/services/data-handler.service';

@Component({
  selector: 'app-compare-sidepanel',
  templateUrl: './compare-sidepanel.component.html',
  styleUrls: ['./compare-sidepanel.component.css']
})
export class CompareSidepanelComponent implements OnInit {
  @Output() targetSBOM = new EventEmitter<[string, string[]]>();
  targetSbom: string = '';
  compareSboms: string[] = [];

  constructor(private dataHandler: DataHandlerService) { }

  ngOnInit() {
    this.compareSboms = this.dataHandler.GetValidSBOMs();
    
  }

}

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SVIPService } from 'src/app/shared/services/SVIP.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-generate-modal',
  templateUrl: './generate-modal.component.html',
  styleUrls: ['./generate-modal.component.css']
})
export class GenerateModalComponent implements OnInit {

  public options: {
    name: string;
    schema: string;
    format: string;
    type: string;
  } = {
    name: '',
    schema: '',
    format: '',
    type: '',
  };

  public choices: {[key: string]: string[]} = {
    'CDX14': ['JSON'],
    'SPDX23': ['TAGVALUE', 'JSON'],
    'SVIP': ['TAGVALUE', 'JSON']
  }

  public types: string[] = ['OSI', 'PARSERS'];

  @Input() opened: boolean = false;
  @Output() close = new EventEmitter<Boolean>();
  private openedSubject = new Subject<boolean>();

  private zippedFileData: any;

  constructor(private service: SVIPService) {}

  ngOnInit(): void {
    this.openedSubject.subscribe((value) => {
      if(!value)
        return;

        this.zippedFileData = undefined;

        this.service.zipProjectDirectory().then((result) => {
          this.zippedFileData = result;
        }).catch((error) => {
          this.Close();
        })
    });
  }

  ngOnChanges(): void {
    this.openedSubject.next(this.opened);
  }

  Generate() {
    if (this.options.schema === '' || this.options.format === '' || this.options.type === '' || this.options.name === '')
      return;

    this.service.uploadProject(this.zippedFileData, 
      this.options.name, 
      this.options.schema, 
      this.options.format, 
      this.options.type);

    this.Close();
  }


  Close() {
    this.close.emit(true);
  }

}
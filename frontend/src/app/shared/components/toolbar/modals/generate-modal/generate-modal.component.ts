import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SVIPService } from 'src/app/shared/services/SVIP.service';
import { SbomService } from 'src/app/shared/services/sbom.service';

@Component({
  selector: 'app-generate-modal',
  templateUrl: './generate-modal.component.html',
  styleUrls: ['./generate-modal.component.css']
})
export class GenerateModalComponent {
  constructor(private service: SVIPService) {}

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

  Generate() {
    if (this.options.schema === '' || this.options.format === '' || this.options.type === '' || this.options.name === '')
      return;

    this.service.uploadProjectDirectory(this.options.name, this.options.schema, this.options.format, this.options.type).then((result) => {
      console.log(result);
    })

    this.Close();
  }


  Close() {
    this.close.emit(true);
  }

}

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SVIPService } from 'src/app/shared/services/SVIP.service';
import { Subject } from 'rxjs';
import { SbomService } from 'src/app/shared/services/sbom.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-generate-modal',
  templateUrl: './generate-modal.component.html',
  styleUrls: ['./generate-modal.component.css']
})
export class GenerateModalComponent implements OnInit {
  public options: {
    name: string,
    schema: string,
    format: string,
    type: string,
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

  public osiTools: {[name: string]: boolean} = {};

  @Input() opened: boolean = false;
  @Output() close = new EventEmitter<Boolean>();
  private openedSubject = new Subject<boolean>();

  public status: GenerationStatus = GenerationStatus.NULL;
  public zippedFileData: any;

  constructor(private service: SVIPService, private sbomService: SbomService, private toast: ToastService) {}

  ngOnInit(): void {
    this.openedSubject.subscribe((value) => {
      if(!value)
        return;

        this.zippedFileData = undefined;
        this.status = GenerationStatus.GENERATING;

        this.service.getProjectDirectory().then((result) => {
          this.status = GenerationStatus.ZIPPING;

          this.service.zipFileDirectory(result).then((data) => {
            this.zippedFileData = data;
            this.status = GenerationStatus.PROJECT_INFO;
          }).catch((error) => {
            this.Close();
          })
        }).catch((error) => {
          this.Close();
        })
    });

    this.service.getOSITools().subscribe((data) => {
      data.forEach((tool) => {
        this.osiTools[tool] = true;
      })
    })
  }

  ngOnChanges(): void {
    this.openedSubject.next(this.opened);
  }

  Generate() {
    if (this.options.schema === '' || this.options.format === '' || this.options.type === '' || this.options.name === '')
      return;

    this.status = GenerationStatus.GENERATING;

    this.service.uploadProject(this.zippedFileData, 
      this.options.name, 
      this.options.schema, 
      this.options.format, 
      this.options.type).then((data: any) => {
        this.sbomService.addSBOMbyID(data);
        this.Close();
      }).catch(() => {
        this.toast.showErrorToast("SBOM Generation", "Failed");
        this.Close();
      })


  }

  OSIToolChange(event: any) {
    this.osiTools[event.name] = event.value;
  }


  Close() {
    this.status = GenerationStatus.NULL;
    this.close.emit(true);
  }

}

enum GenerationStatus {
  NULL,
  SELECTING_DIRECTORY,
  ZIPPING,
  PROJECT_INFO,
  GENERATING,
}
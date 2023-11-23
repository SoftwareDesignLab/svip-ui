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

            //TODO: Prompt user beforehand on OSI or Parsers so don't need to upload project if don't have to OR the backend should be reworked for parsers
            this.service.uploadProject(data, 'osi').then((tools: any) => {

              tools.forEach((tool: any) => {
                this.osiTools[tool] = true;
              })

              this.zippedFileData = data;
              this.status = GenerationStatus.PROJECT_INFO;

            }).catch((error) => {
              this.Close();
            })
          }).catch((error) => {
            this.Close();
          })
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

    this.status = GenerationStatus.GENERATING;

    let tools = [];

    for (let key in this.osiTools) {
      if (this.osiTools[key])
        tools.push(key);
    }

    this.service.generateFile(this.zippedFileData,
      this.options.name,
      this.options.schema,
      this.options.format,
      this.options.type,
      tools).then((data: any) => {
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

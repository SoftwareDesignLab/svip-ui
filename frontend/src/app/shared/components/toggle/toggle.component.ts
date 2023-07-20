import { Component } from '@angular/core';
import { IpcRenderer } from 'electron';
import { SVIPService, generate } from '../../services/SVIP.service';
import { SbomService } from '../../services/sbom.service';
import { GENERATORS } from '../../services/SVIP.service';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.css'],
})
export class ToggleComponent {
  loading = false;
  upload: boolean = false;
  private ipc!: IpcRenderer;
  public generateModal: boolean = false;
  public generateOptions: {
    projectName: string;
    schema: string;
    format: string;
  } = {
    schema: '',
    format: '',
    projectName: '',
  };
  public schemaOptions: string[] = ['CDX14', 'SPDX23', 'SVIP'];
  public formatOptions: string[] = ['TAGVALUE', 'JSON'];
  filePaths: string[] = [];

  constructor(
    private svipService: SVIPService,
    private sbomService: SbomService
  ) {}

  private async _browse(): Promise<string[]> {
    const files = (await this.svipService.browseFiles()) || [];
    this.filePaths = files;
    return this.filePaths;
  }

  async browse(addFiles = true) {
    const files = await this._browse();
    if (addFiles && files.length) {
      this.sbomService.AddFiles(files);
    }
  }

  // onGenerateDrop(event: DragEvent) {
  //   event.preventDefault();
  //   event.stopPropagation();

  //   const files = event.dataTransfer?.files;
  //   if (files && files.length > 0) {
  //     const filePath = files[0].path;
  //     this.generateModal = true;
  //   }
  // }

  /**
   * Get SBOM filename
   */
  getAlias(sbom: string) {
    return this.sbomService.getSBOMAlias(sbom);
  }

  onGenerate() {
    this._browse().then((files) => {
      if (files.length) {
        this.generateModal = true;
      }
    });
  }

  async generateParser() {
    this.loading = true;
    let generateObj: generate = {
      files: [],
      projectName: this.generateOptions.projectName,
      format: this.generateOptions.format,
      schema: this.generateOptions.schema,
    };
    let results: Promise<void>[] = [];
    this.filePaths.forEach((fileName) => {
      const res = this.svipService.getFileData(fileName).then((contents) => {
        if (contents) {
          console.log(contents);
          generateObj.files.push({ fileName, contents });
        }
      });
      results.push(res);
    });
    Promise.all(results).then(
      () =>
        this.svipService
          .generateSBOM(GENERATORS.parsers, generateObj)
          .subscribe(() => {
            this.loading = false;
            this.generateModal = false;
            this.sbomService.fetch();
          }),
      () => {
        this.loading = false;
        this.generateModal = false;
      }
    );
  }
}

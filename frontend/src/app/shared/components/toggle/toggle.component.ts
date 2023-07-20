import { Component } from '@angular/core';
import { IpcRenderer } from 'electron';
import { SVIPService } from '../../services/SVIP.service';
import { SbomService } from '../../services/sbom.service';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.css']
})
export class ToggleComponent {
  upload: boolean = false;
  private ipc!: IpcRenderer;
  public selectedFileAlias: string | undefined = undefined;
  public selectedFilePath: string | undefined = undefined;
  public generateModal: boolean = false;
  public convertOptions: {
    schema: string,
    format: string
    overwrite: boolean
  } = {
    schema: '',
    format: '',
    overwrite: true,
  };
  public schemaOptions: string[] = ['TAGVALUE', "JSON"];
  public formatOptions: string[] = ['CDX14', "SPDX23", "SVIP"];

  constructor(private svipService: SVIPService, private sbomService: SbomService) {
  }

  browse() {
    this.svipService.browseFiles().then((files: string[]) => {
      if (files === undefined || files === null || files.length === 0) {
        return;
      }

      this.sbomService.AddFiles(files);
    });
  }

  /**
   * Get SBOM filename
   */
  getAlias(sbom: string) {
    return this.dataHandler.getSBOMAlias(sbom);
  }

  onGenerateDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const filePath = files[0].path;
      this.selectedFilePath = filePath;
      this.selectedFileAlias = this.getAlias(filePath);
      this.generateModal = true;
    }
  }
}

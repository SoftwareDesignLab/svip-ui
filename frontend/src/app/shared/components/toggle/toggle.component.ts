import { Component } from '@angular/core';
import { DataHandlerService } from '../../services/data-handler.service';
import { IpcRenderer } from 'electron';

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

  constructor(private dataHandler: DataHandlerService) {
    if (window.require) {
      try {
        this.ipc = window.require('electron').ipcRenderer;
      } catch (e) {
        console.log(e);
      }
    } else {
      console.warn('App not running inside Electron!');
    }
  }

  browse() {
    this.ipc.invoke('selectFiles').then((files: string[]) => {
      if (files === undefined || files === null || files.length === 0) {
        return;
      }

      this.dataHandler.AddFiles(files);
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

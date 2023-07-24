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
}

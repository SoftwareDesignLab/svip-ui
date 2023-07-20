import { Component } from '@angular/core';
import { SbomService } from '../../services/sbom.service';
import { PAGES, RoutingService } from '../../services/routing.service';
import { FileStatus } from '../../models/file';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})

export class ToolbarComponent {
  constructor(private sbomService: SbomService, public routing: RoutingService) {}
  public deleteModal: boolean = false;
  public convertModal: boolean = false;
  public compareModal: boolean = false;
  public downloadModal: boolean = false;

  public convertOptions: {
    schema: string;
    format: string;
    overwrite: boolean;
  } = {
    schema: '',
    format: '',
    overwrite: true,
  };
  public formatOptions: string[] = ['TAGVALUE', 'JSON'];
  public schemaOptions: string[] = ['CDX14', 'SPDX23', 'SVIP'];
  protected compareTarget: string = '';

  GetAllFiles() {
    return this.sbomService.getSBOMNames();
  }

  GetSBOMInfo(file: string) {
    return this.sbomService.GetSBOMInfo(file);
  }

  GetSelected() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let selected: string[] = [];

    for (let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i] as HTMLInputElement;
      if (checkbox.checked && !checkbox.disabled && checkbox.value != 'null') {
        selected.push(checkbox.value);
      }
    }

    return selected;
  }

  DownloadSelected() {
    const selectedFiles = this.GetSelected();
    const hasFiles = selectedFiles.length;
    const hasErroredFiles = selectedFiles.filter((sbom) => this.GetSBOMInfo(sbom).status === FileStatus.ERROR).length;

    if (!hasFiles || hasErroredFiles) {
      this.downloadModal = true;
      setTimeout(() => {
        this.downloadModal = false;
      }, 4000);
      return;
    }

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const name = this.GetSBOMInfo(file).fileName;
      const sbom = this.sbomService.downloadSBOM(file);
      if (sbom) {
        const url = URL.createObjectURL(sbom);
        const link = document.createElement('a');
        link.href = url;
        link.download = name as string;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      break;
    }
  }

  ConvertSelected() {
    if (this.convertOptions.schema === '' || this.convertOptions.format === '')
      return;

    this.GetSelected().forEach((file) => {
      this.sbomService.ConvertSBOM(
        file,
        this.convertOptions.schema,
        this.convertOptions.format,
        this.convertOptions.overwrite
      );
    });

    this.convertModal = false;
  }

  CompareSelected() {
    this.routing.SetPage(2);

    let others = this.GetSelected().filter((x) => x !== this.compareTarget);
    this.sbomService.CompareSBOMs(this.compareTarget, others);

    this.compareModal = false;
  }

  /**
   * Removes file from uploaded files
   * @param file file to remove
   */
  RemoveFile(file: string) {
    if (this.routing.GetPage() === PAGES.VIEW && this.routing.data === file) {
      this.routing.SetPage(PAGES.NONE);
      this.routing.data = undefined;
    }

    this.sbomService.deleteFile(file);
  }

  DeleteSelected() {
    this.GetSelected().forEach((file) => {
      this.RemoveFile(file);
    });

    this.deleteModal = false;
  }

  ViewSBOM() {
    let selected = this.GetSelected();

    if (selected.length !== 1) return;

    this.routing.SetPage(PAGES.VIEW);
    this.routing.data = selected[0];
  }
}

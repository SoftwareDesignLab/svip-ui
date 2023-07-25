import { Component, HostListener, OnInit } from '@angular/core';
import { SbomService } from 'src/app/shared/services/sbom.service';
import { PAGES, RoutingService } from 'src/app/shared/services/routing.service';
import { FileStatus } from 'src/app/shared/models/file';
import { SVIPService } from 'src/app/shared/services/SVIP.service';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  public show: boolean = false;
  public filterSearch: string = '';
  public downloadModal: boolean = false;
  public deleteModal: boolean = false;
  public convertModal: boolean = false;
  public compareModal: boolean = false;

  protected sortingOptions: { [type: string]: boolean } = {
    NAME: true,
    FORMAT: true,
  };

  private selectedSorting: SORT_OPTIONS = SORT_OPTIONS.NAME;

  constructor(
    private sbomService: SbomService,
    public routing: RoutingService,
    private svipService: SVIPService,
  ) {}

  ngOnInit() {
    this.sbomService.getAllSBOMs();
  }

  /**
   *  Prompts user to select files and tries to upload them
   */
  browse() {
    this.svipService.browseFiles().then((files: string[]) => {
      if (files === undefined || files === null || files.length === 0) {
        return;
      }

      this.sbomService.AddFiles(files);
    });
  }

  /**
   *  Checks if any files have been uploaded
   */
  ContainsFiles() {
    this.sbomService.GetSBOMsOfStatus(FileStatus.VALID).length > 0 ||
      this.sbomService.GetSBOMsOfStatus(FileStatus.LOADING).length > 0;
  }

  GetSelected() {
    const checkboxes = document.querySelectorAll('.sbom-checkbox');
    let selected: string[] = [];

    for (let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i] as HTMLInputElement;
      if (checkbox.checked && !checkbox.disabled && checkbox.value != 'null') {
        selected.push(checkbox.value);
      }
    }

    return selected;
  }

  GetAllFiles() {
    return this.sbomService.getSBOMNames();
  }

  /**
   *  Gets uploaded files
   */
  GetSBOMsOfType(statusString: string) {
    let status = FileStatus[statusString as keyof typeof FileStatus];

    if (this.selectedSorting === SORT_OPTIONS.NAME)
      return this.sbomService
        .GetSBOMsOfStatus(status)
        .sort((a: string, b: string) => {
          return this.sortingOptions[SORT_OPTIONS.NAME]
            ? a.localeCompare(b)
            : b.localeCompare(a);
        });

    return this.sbomService
      .GetSBOMsOfStatus(status)
      .sort((a: string, b: string) => {
        let aFormat = this.sbomService.GetSBOMSchema(a);
        let bFormat = this.sbomService.GetSBOMSchema(b);

        return this.sortingOptions[SORT_OPTIONS.SCHEMA]
          ? aFormat.localeCompare(bFormat)
          : bFormat.localeCompare(aFormat);
      });
  }

  GetSBOMInfo(file: string) {
    return this.sbomService.GetSBOMInfo(file);
  }

  GetSBOMSchemas() {
    return this.sbomService.getSBOMschemas();
  }

  ValidSBOMSchema(path: string) {
    return this.GetSBOMSchemas()[this.sbomService.GetSBOMInfo(path).schema];
  }

  SbomFormatFilterChange(event: any) {
    this.sbomService.SetSBOMSchema(event.name, event.value);
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

  setAllSelected(event: any) {
    let value = event.target.checked;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    for (let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i] as HTMLInputElement;
      checkbox.checked = value;
    }
  }

  UpdateSort(type: string) {
    let sort = SORT_OPTIONS[type as keyof typeof SORT_OPTIONS];

    this.sortingOptions[sort] = !this.sortingOptions[sort];
    this.selectedSorting = sort;
  }


  DeleteSelected() {
    this.GetSelected().forEach((file) => {
      this.RemoveFile(file);
    });

    this.deleteModal = false;
  }

  DownloadSelected() {
    const selectedFiles = this.GetSelected();
    const hasFiles = selectedFiles.length;
    const hasErroredFiles = selectedFiles.filter(
      (sbom) => this.GetSBOMInfo(sbom).status === FileStatus.ERROR
    ).length;

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

  DownloadSelectedAsZip() {
    const selectedFiles = this.GetSelected();
    const zip = new JSZip();

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const name = this.GetSBOMInfo(file).fileName;
      const sbom = this.sbomService.downloadSBOM(file);

      if (sbom) {
        zip.file(name as string, sbom);
      }
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'files.zip');
    });
  }

  /**
   * Get SBOM filename
   */
  getAlias(sbom: string) {
    return this.sbomService.getSBOMAlias(sbom)?.split('.')[0];
  }

  /**
   * Handles the file drop event
   * @param event The drop event
   */
  @HostListener('document:drop', ['$event'])
  onDocumentDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.onFileDrop(event);
  }

  /**
   * Handles the drag over event
   * @param event The drag over event
   */
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Add any visual indication for the drag over event (e.g., highlighting the dropzone)
  }

  /**
   * Handles the drag leave event
   * @param event The drag leave event
   */
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Remove any visual indication for the drag leave event
  }

  /**
   * Handles the file drop event
   * @param event The drop event
   */
  onFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const filePaths = Array.from(files).map((file) => file.path);
      this.sbomService.AddFiles(filePaths);
    }
  }

  ClearSearch() {
    this.filterSearch = ''; 
    const searchInput = document.querySelector('input[name="search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
  }

  UpdateSearch(event: any) {
    this.filterSearch = event.target.value;
  }

  GetFilter() {
    return this.filterSearch;
  }

  ViewSBOM() {
    let selected = this.GetSelected();

    if (selected.length !== 1) return;

    this.routing.SetPage(PAGES.VIEW);
    this.routing.data = selected[0];
  }

}

export enum SORT_OPTIONS {
  NAME = 'NAME',
  SCHEMA = 'SCHEMA',
}

import { Component, HostListener, OnInit } from '@angular/core';
import { SbomService } from 'src/app/shared/services/sbom.service';
import { PAGES, RoutingService } from 'src/app/shared/services/routing.service';
import { FileStatus } from 'src/app/shared/models/file';
import { SVIPService } from 'src/app/shared/services/SVIP.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  private filterSearch: string = '';
  public show: boolean = false;

  public downloadModal: boolean = false;

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

  UpdateSearch(event: any) {
    this.filterSearch = event.target.value;
  }

  GetFilter() {
    return this.filterSearch;
  }

}

export enum SORT_OPTIONS {
  NAME = 'NAME',
  SCHEMA = 'SCHEMA',
}

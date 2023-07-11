import { Component, HostListener, OnInit } from '@angular/core';
import { IpcRenderer } from 'electron';
import { DataHandlerService, FileStatus } from 'src/app/shared/services/data-handler.service';
import { PAGES, RoutingService } from 'src/app/shared/services/routing.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit{
  private ipc!: IpcRenderer;
  private filterSearch: string = '';
  public deleteModal: boolean = false;

  private sortingOptions: { [type: string]: boolean } = {
    "NAME": true,
    "FORMAT": true,
  }

  private selectedSorting: SORT_OPTIONS = SORT_OPTIONS.NAME;

  constructor(private dataHandler: DataHandlerService, public routing: RoutingService) {
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

  ngOnInit() {}

  /**
   *  Prompts user to select files and tries to upload them
   */
  browse() {
    this.ipc.invoke('selectFiles').then((files: string[]) => {
      if (files === undefined || files === null || files.length === 0) {
        return;
      }

      this.dataHandler.AddFiles(files);
    });
  }

  /**
   *  Checks if any files have been uploaded
   */
  ContainsFiles() {
    this.dataHandler.GetSBOMsOfType(FileStatus.VALID).length > 0 || this.dataHandler.GetSBOMsOfType(FileStatus.LOADING).length > 0;
  }

  GetAllFiles() {
    return this.dataHandler.GetAllFiles();
  }

  /**
   *  Gets uploaded files
   */
  GetSBOMsOfType(statusString: string) {

    let status = FileStatus[statusString as keyof typeof FileStatus];

    if(this.selectedSorting === SORT_OPTIONS.NAME)
      return this.dataHandler.GetSBOMsOfType(status).sort((a: string, b: string) => {return this.sortingOptions[SORT_OPTIONS.NAME] ? a.localeCompare(b) : b.localeCompare(a)});

      return this.dataHandler.GetSBOMsOfType(status).sort((a: string, b: string) => {

        let aFormat = this.dataHandler.GetSBOMFormat(a);
        let bFormat = this.dataHandler.GetSBOMFormat(b);

        return this.sortingOptions[SORT_OPTIONS.FORMAT] ? aFormat.localeCompare(bFormat) : bFormat.localeCompare(aFormat)
      });
  }

  GetSBOMInfo(file: string) {
    return this.dataHandler.GetSBOMInfo(file);
  }

  GetSBOMFormats() {
    return this.dataHandler.GetSBOMFormats();
  }

  ValidSBOMFormat(path: string) {
     return this.GetSBOMFormats()[this.GetSBOMInfo(path).qr.originFormat] === true;
  }

  SbomFormatFilterChange(event: any) {
    this.dataHandler.SetSBOMFormat(event.name, event.value);
  }

  /**
   * Removes file from uploaded files
   * @param file file to remove
   */
  RemoveFile(file: string) {

    if(this.routing.GetPage() === PAGES.VIEW && this.routing.data === file) {
      this.routing.SetPage(PAGES.NONE);
      this.routing.data = undefined;
    }

    this.dataHandler.DeleteFile(file);
  }

  setAllSelected(event: any) {

    let value = event.target.checked;

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    for (let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i] as HTMLInputElement;
      checkbox.checked = value;
    }
  }

  GetSelected() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let selected: string[] = [];

    for (let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i] as HTMLInputElement;
      if (checkbox.checked && !checkbox.disabled) {
        selected.push(checkbox.value);
      }
    }

    return selected;
  }

  DeleteSelected() {
    this.GetSelected().forEach((file) => {
      this.RemoveFile(file);
    })

    this.deleteModal = false;
  }

  ConvertSelected() {

  }

  /**
   * Get SBOM filename
   */
  getAlias(sbom: string) {
    return this.dataHandler.getSBOMAlias(sbom);
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
       this.dataHandler.AddFiles(filePaths);
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

    if(selected.length !== 1)
      return;

    this.routing.SetPage(PAGES.VIEW);
    this.routing.data = selected[0];
   }
}

export enum SORT_OPTIONS {
  NAME = "NAME",
  FORMAT = "FORMAT"
}

import { Component, HostListener, OnInit } from '@angular/core';
import { IpcRenderer } from 'electron';
import { DataHandlerService, FileStatus } from 'src/app/shared/services/data-handler.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit{
  private ipc!: IpcRenderer;

  constructor(
    private dataHandler: DataHandlerService,
    ) {
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
  GetValidSBOMs() {
    return this.dataHandler.GetSBOMsOfType(FileStatus.VALID);
  }

  /**
   *  Gets files that are still being uploaded from data handler
   */
  GetLoadingSBOMs() {
    return this.dataHandler.GetSBOMsOfType(FileStatus.LOADING);
  }

  GetErrorSBOMs() {
    return this.dataHandler.GetSBOMsOfType(FileStatus.ERROR);
  }


  GetSBOMInfo(file: string) {
    return this.dataHandler.GetSBOMInfo(file);
  }

  /**
   * Removes file from uploaded files
   * @param file file to remove
   */
  RemoveFile(file: string) {
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

  DeleteSelected() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    for (let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i] as HTMLInputElement;
      if (checkbox.checked && !checkbox.disabled) {
        this.RemoveFile(checkbox.value);
      }
    }
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

}

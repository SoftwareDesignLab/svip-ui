import { Component, OnInit } from '@angular/core';
import { IpcRenderer } from 'electron';
import { DataHandlerService, FileStatus } from 'src/app/shared/services/data-handler.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit{
  private ipc!: IpcRenderer;
  selectedFiles: string[] = [];
  selectedFile: string = '';

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

  /**
   *  Gets uploaded files
   */
  GetFiles() {
    return this.dataHandler.GetSBOMsOfType(FileStatus.VALID);
  }

  /**
   *  Gets files that are still being uploaded from data handler
   */
  GetLoadingFiles() {
    return this.dataHandler.GetSBOMsOfType(FileStatus.LOADING);
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

  /**
   * Stores or removes sboms based on checkbox
   */
  check(sbom: any) {
    const value = sbom.target.value;
    if (sbom.target.checked) {
      this.selectedFiles.push(value);
    } else {
      this.selectedFiles.indexOf(value);
      this.selectedFiles = this.selectedFiles.filter((file) => file !== value);
    }
  }

  /**
   * Checks if all valid SBOMS are selected
   */
  areAllSelected() {
    return this.selectedFiles.length === this.dataHandler.GetSBOMsOfType(FileStatus.VALID).length;
  }

  /**
   * Selects all sboms
   */
  selectAll() {
    if (this.areAllSelected()) {
      this.selectedFiles = [];
    } else {
      this.selectedFiles = this.dataHandler.GetSBOMsOfType(FileStatus.VALID);
    }
  }

  /**
   * Delete Multiple SBOMS at once
   */
  delete() {
    this.selectedFiles.forEach((file) => {
      this.RemoveFile(file);
    });
    this.selectedFiles = [];
  }


  /**
   * Get SBOM filename
   */
  getAlias(sbom: string) {
    return this.dataHandler.getSBOMAlias(sbom);
  }
}
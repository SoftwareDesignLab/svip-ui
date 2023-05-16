import { Component, OnInit } from '@angular/core';
import { DataHandlerService } from 'src/app/shared/services/data-handler.service';
import { IpcRenderer } from 'electron';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-sboms-page',
  templateUrl: './manage-sboms-page.component.html',
  styleUrls: ['./manage-sboms-page.component.css'],
})
export class ManageSbomsPageComponent implements OnInit {
  private ipc!: IpcRenderer;
  selectedFiles: string[] = [];

  constructor(
    private dataHandler: DataHandlerService,
    private modalService: NgbModal
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
    return (
      Object.keys(this.dataHandler.metrics).length > 0 ||
      this.GetLoadingFiles().length > 0
    );
  }

  /**
   *  Gets uploaded files
   */
  GetFiles() {
    return this.dataHandler.metrics;
  }

  /**
   *  Gets files that are still being uploaded from data handler
   */
  GetLoadingFiles() {
    return this.dataHandler.loadingFiles;
  }

  /**
   * Removes file from uploaded files
   * @param file file to remove
   */
  RemoveFile(file: string) {
    this.dataHandler.filePaths = this.dataHandler.filePaths.filter(
      (x) => x != file
    );
    delete this.dataHandler.metrics[file];
  }

  /**
   * Stores or removes sboms based on checkbox
   */
  check(sbom: any) {
    console.log(sbom.target);
  }

  areAllSelected() {
    return (
      this.selectedFiles.length === this.dataHandler.GetValidSBOMs().length
    );
  }

  selectAll() {
    if (this.areAllSelected()) {
      this.selectedFiles = [];
    } else {
      this.selectedFiles = this.dataHandler.GetValidSBOMs();
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

  // Uhhh whatever the fuck bootstraps doing
  closeResult = '';

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
}

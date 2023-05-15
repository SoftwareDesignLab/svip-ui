import { Component, OnInit } from '@angular/core';
import { DataHandlerService } from 'src/app/shared/services/data-handler.service';
import { IpcRenderer } from 'electron';

@Component({
  selector: 'app-manage-sboms-page',
  templateUrl: './manage-sboms-page.component.html',
  styleUrls: ['./manage-sboms-page.component.css'],
})
export class ManageSbomsPageComponent implements OnInit {
  private ipc!: IpcRenderer;
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

  ngOnInit() {}

  browse() {
    this.ipc.invoke('selectFiles').then((files: string[]) => {
      if (files === undefined || files === null || files.length === 0) {
        return;
      }

      this.dataHandler.AddFiles(files);
    });
  }

  ContainsFiles() {
    return (
      Object.keys(this.dataHandler.metrics).length > 0 ||
      this.GetLoadingFiles().length > 0
    );
  }

  GetFiles() {
    return this.dataHandler.metrics;
  }

  GetLoadingFiles() {
    return this.dataHandler.loadingFiles;
  }

  RemoveFile(file: string) {
    this.dataHandler.filePaths = this.dataHandler.filePaths.filter(
      (x) => x != file
    );
    delete this.dataHandler.metrics[file];
  }
}

/**@author Justin Jantzi*/
import { Comparison } from 'src/app/features/compare/comparison';
import { Injectable, OnInit } from '@angular/core';
import { ClientService } from './client.service';
import { IpcRenderer } from 'electron';
import { QualityReport, test } from 'src/app/features/metrics/test';
import { HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataHandlerService implements OnInit {
  private ipc!: IpcRenderer;
  public lastSentFilePaths: string[] = [];
  private files: { [path: string]: SBOMInfo } = {};

  public selectedQualityReport!: string;

  constructor(private client: ClientService) {
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

  ngOnInit(): void {}

  async AddFiles(paths: string[]) {
    paths.forEach((path) => {
      this.files[path] = {
        status: FileStatus.LOADING,
      };
      this.ipc.invoke('getFileData', path).then((contents) => {
        if (contents) {
          this.saveSBOM(path, contents).subscribe(
            (result) => {
              if (result) {
                this.files[path] = {
                  status: FileStatus.VALID,
                  id: result as number,
                  fileName: this.getSBOMAlias(path),
                  raw: contents
                };
              }
            },
            (error) => {
              this.files[path] = {
                status: FileStatus.ERROR,
              };
            }
          );
        }
      });
    });
  }

  /**
   * Save an SBOM in the database for future use
   * @param fileName File name
   * @param contents contents of the sbom
   */
  saveSBOM(fileName: string, contents: string) {
    return this.client.post('upload', {
      contents: contents,
      fileName: fileName,
    });
  }

  DeleteFile(path: string) {
    delete this.files[path];
  }

  GetSBOMsOfType(status: FileStatus) {
    return Object.keys(this.files).filter(
      (x) => this.files[x].status === status
    );
  }

  GetAllFiles() {
    return Object.keys(this.files);
  }

  GetSBOMInfo(path: string) {
    return this.files[path];
  }

  GetMetrics(path: string) {
    return this.GetSBOMInfo(path).metrics;
  }

  getSBOMAlias(path: string) {
    const pathChar = path.indexOf('/') !== -1 ? '/' : '\\';
    return path.split(pathChar).pop();
  }

  downloadSBOM(filePath: string) {
    const file = this.files[filePath]?.raw;
    if (file !== undefined) {
      return new Blob([file]);
    }
    return null;
  }

  getSavedSBOMNames(): Promise<Object> {
    return new Promise<Object>((resolve) => {
      this.client.get('viewFiles').subscribe((result) => {
        resolve(result);
      });
    });
  }

  getSavedSBOM(name: string) {
    return new Promise<any>((resolve) => {
      this.client
        .get('view', new HttpParams().set('id', name))
        .subscribe((result) => {
          resolve(result);
        });
    });
  }
}

export interface File {
  fileName: string;
  contents: string;
}

export interface SBOMInfo {
  status: FileStatus;
  id?: number;
  metrics?: QualityReport;
  extra?: string;
  contents?: string;
  fileName?: string;
  raw?: string;
}

export enum FileStatus {
  LOADING,
  ERROR,
  VALID,
}


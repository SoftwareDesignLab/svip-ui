/**@author Justin Jantzi*/
import { Injectable, OnInit } from '@angular/core';
import { ClientService } from './client.service';
import { IpcRenderer } from 'electron';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataHandlerService implements OnInit {
  private ipc!: IpcRenderer;
  private files: { [path: string]: SBOMInfo } = {};
  private sbomFormats: { [name: string]: boolean } = {};
  public comparison: any;

  sboms = new BehaviorSubject<any[]>([]);

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

  ngOnInit(): void {
    this.getSavedSBOMs().forEach(id => {
      this.getSBOM(id as number).subscribe(sbom => {
        if (sbom) {
          console.log(sbom);
        }
      })
    })
  }

  //#region SBOMS/File Endpoints
  /**
   * Save an SBOM in the database for future use
   * @param fileName File name
   * @param contents contents of the sbom
   */
  saveSBOM(fileName: string, contents: string): Observable<number> {
    return this.client.post('upload', {
      contents: contents,
      fileName: fileName,
    }) as Observable<number>;
  }

  /**
   * Get an SBOM in the database
   * @param id SBOM id
   */
  getSBOM(id: number): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.client.get('getSBOM', params);
  }

  GetSBOMFormats() {
    return this.sbomFormats;
  }

  IncludeSBOMFormat(name: string) {
    return this.sbomFormats[name];
  }

  SetSBOMFormat(name: string, value: boolean) {
    this.sbomFormats[name] = value;
  }

  getSBOMContents(id: number) {
    return this.client.get('view', new HttpParams().set('id', id));
  }

  getSavedSBOMs() {
    return this.client.get('viewFiles');
  }



  deleteFile(path: string) {
    const id = this.files[path].id;
    if (typeof id === 'number') {
      this._deleteSBOM(id);
    }
    delete this.files[path];
  }

  private _deleteSBOM(id: number) {
    return this.client.get('delete', new HttpParams().set('id', id));
  }

  downloadSBOM(filePath: string) {
    const file = this.files[filePath]?.contents;
    if (file !== undefined) {
      return new Blob([file]);
    }
    return null;
  }



  //#endregion
  //#region SBOM/File Helpers
  GetAllFiles() {
    return Object.keys(this.files);
  }

  async AddFiles(paths: string[]) {
    paths.forEach((path) => {
      this.files[path] = {
        id: -1,
        status: FileStatus.LOADING,
      };
      this.ipc.invoke('getFileData', path).then((contents) => {
        if (contents) {
          this.saveSBOM(path, contents).subscribe(
            (id) => {
              if (id) {
                this.getSBOM(id).subscribe((sbom) => {
                  sbom as any;
                  this.files[path] = {
                    status: FileStatus.VALID,
                    id: id,
                    type: sbom?.format,
                    fileName: this.getSBOMAlias(path),
                    contents: contents,
                  };
                });
              }
            },
            (error) => {
              this.files[path] = {
                id: -1,
                status: FileStatus.ERROR,
              };
            }
          );
        }
      });
    });
  }

  GetSBOMsOfType(status: FileStatus) {
    return Object.keys(this.files).filter(
      (x) => this.files[x].status === status
    );
  }

  GetSBOMFormat(path: string) {
    return this.files[path].qr.originFormat;
  }

  GetSBOMInfo(path: string) {
    return this.files[path];
  }
  ContainsSBOMFormat(format: string) {
    return this.sbomFormats[format] !== undefined;
  }

  getSBOMAlias(path: string) {
    const pathChar = path.indexOf('/') !== -1 ? '/' : '\\';
    return path.split(pathChar).pop();
  }

  CompareSBOMs(target: string, others: string[]) {
    let targetID = this.files[target].id;

    let idList = [];

    for (let i = 0; i < others.length; i++) {
      let other = others[i];
      idList.push(this.files[other].id);
    }

    idList.unshift(targetID);

    this.client
      .get(
        'compare',
        new HttpParams()
          .set('Ids', JSON.stringify(idList))
          .set('targetIndex', 0)
      )
      .subscribe((result) => {
        this.comparison = result;
      });
  }

  ConvertSBOM(
    path: string,
    schema: string,
    format: string,
    overwrite: boolean
  ) {
    let sbom = this.files[path];
    let id = sbom.id ? sbom.id : -1;

    this.client
      .get(
        'convert',
        new HttpParams()
          .set('id', id)
          .set('schema', schema)
          .set('format', format)
          .set('overwrite', overwrite)
      )
      .subscribe((result) => {
        if (result) {
          delete this.files[path].contents;
          if (this.files[path].id !== undefined){
            this.files[path].id += 1;
          }
          this.setContents(path);
          this.files[path].type = format;
        }
      });
  }

  setContents(path: string) {
    const sbom = this.files[path];
    // Hotfix: not returning as string for some reason
    this.getSBOMContents(sbom.id).subscribe(content => {this.files[path].contents = JSON.stringify(content)});
    return this.files[path].contents;
  }
  //#endregion
}

//#region Interfaces

export interface File {
  fileName: string;
  contents: string;
}

export interface SBOMInfo {
  status: FileStatus;
  id: number;
  metrics?: any;
  qr?: any;
  extra?: string;
  contents?: string;
  fileName?: string;
  type?: string;
}

export enum FileStatus {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  VALID = 'VALID',
}
//#endregion

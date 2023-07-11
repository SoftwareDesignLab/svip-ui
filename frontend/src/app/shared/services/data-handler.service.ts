/**@author Justin Jantzi*/
import { Comparison } from 'src/app/features/compare/comparison';
import { Injectable, OnInit } from '@angular/core';
import { ClientService } from './client.service';
import { IpcRenderer } from 'electron';
import { QualityReport, test } from 'src/app/features/metrics/test';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService implements OnInit {

  private ipc!: IpcRenderer;
  public lastSentFilePaths: string[] = [];

  private files: { [path: string]: SBOMInfo } = {};

  private sbomFormats: { [name: string]: boolean} = {};

  public comparison!: Comparison | null;

  private loadingComparison: boolean = false;
  private loadingMetrics: boolean = false;

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

  ngOnInit(): void {
      this.getSavedSBOMNames().then((results) => {
        if(Array.isArray(results)) {
          results.forEach((fileName) => {
            this.getSavedSBOM(fileName).then((data) => {
              this.ValidateFile(fileName, data);
            })
          })
        }
      })
  }

  AddFiles(paths: string[]) {
    paths.forEach((path) => {

      this.files[path] = {
        status: FileStatus.LOADING,
      }

      this.ValidateFile(path);
    })
  }

  RunAllMetrics() {
    Object.keys(this.files).forEach((file) => {
      this.ValidateFile(file, true);
    })
  }

  IsLoadingComparison() {
    return this.loadingComparison;
  }

  IsLoadingMetrics() {
    return this.loadingMetrics;
  }

  async ValidateFile(path: string, metrics: boolean = false, contents='') {
    if (metrics) {
      this.loadingMetrics = true;
    }

    let data = contents === '' ? await this.ipc.invoke('getFileData', path) : contents;

    this.client.post(metrics ? "qa" : "parse", {'fileName': path, 'contents': data}).subscribe((result: any) => {
      this.files[path].status = FileStatus.VALID;
      this.files[path].contents = data;

      if(metrics) {
        this.loadingMetrics = false;
        this.files[path].metrics = new QualityReport(result as test);
      } else {
        this.files[path].qr = result;

        let format = result.originFormat;

        if(!this.ContainsSBOMFormat(format))
          this.sbomFormats[format] = true;
      }

      this.saveSBOM(path, data);
    },
    (error) => {
      this.loadingMetrics = false;
      this.files[path].status = FileStatus.ERROR;
      this.files[path].extra = error.error;
    })
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



  DeleteFile(path: string) {
    delete this.files[path];
  }

  GetSBOMsOfType(status: FileStatus) {
    return Object.keys(this.files).filter((x) => this.files[x].status === status);
  }

  GetAllFiles() {
    return Object.keys(this.files);
  }

  GetSBOMInfo(path: string) {
    return this.files[path];
  }

  GetSBOMFormat(path: string) {
    return this.files[path].qr.originFormat;
  }

  GetMetrics(path: string) {
    return this.GetSBOMInfo(path).metrics;
  }

  ContainsSBOMFormat(format: string) {
    return this.sbomFormats[format] !== undefined;
  }


  getSBOMAlias(path: string) {
    const pathChar =  path.indexOf('/') !== -1 ? '/' : '\\';
    return path.split(pathChar).pop();
  }

  async Compare(main: string, others: string[]): Promise<any> {
    this.loadingComparison = true;
    let paths = [main, ...others];
    let files: File[] = [];

    for(let i = 0; i < paths.length; i++) {
      let path = paths[i];
      let data = await this.ipc.invoke('getFileData', path);

      files.push({
        'fileName': path,
        'contents': data
      })
    }

    this.lastSentFilePaths = paths;

    return this.client.post("compare", files, new HttpParams().set('targetIndex', 0));

  }

  generateSBOM(fileContents : string[], fileNames : string[], schema? : string, format? : string){
    return this.client.post("generate", {'fileContents': fileContents, 'fileNames': fileNames, 'schemaName': schema, 'formatName': format});
  }

  merge(fileContents : string[], fileNames : string[], schema : string, format : string){
    return this.client.post("merge", {'fileContents': fileContents, 'fileNames': fileNames, 'schema': schema, 'format': format});
  }

  /**
   * Save an SBOM in the database for future use
   * @param fileName File name
   * @param contents contents of the sbom
   */
  saveSBOM(fileName: string, contents: string) {
    return this.client.post("upload", {'contents': contents, 'fileName': fileName});
  }

  getSavedSBOMNames(): Promise<Object> {
    return new Promise<Object>((resolve) => {
      this.client.get("viewFiles").subscribe((result) => {
        resolve(result);
      });
    });
  }

  getSavedSBOM(name: string) {
    return new Promise<any>((resolve) => {
      this.client.get("view", new HttpParams().set("id", name)).subscribe((result) => {
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
  metrics?: QualityReport;
  qr?: any;
  extra?: string;
  contents?: string;
}

export enum FileStatus {
  LOADING = "LOADING",
  ERROR = "ERROR",
  VALID = "VALID"
}

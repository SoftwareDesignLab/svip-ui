import { Injectable } from '@angular/core';
import { SVIPService } from './SVIP.service';
import { SBOM } from '../models/sbom';

@Injectable({
  providedIn: 'root',
})
export class SbomService {
  private sbomFormats: { [name: string]: boolean } = {};
  public comparison: any;
  private files: { [path: string]: File } = {};
  private failedUploadCount = -1;

  constructor(private SVIPService: SVIPService) {}

  getAllSBOMs() {
    this.SVIPService.getSBOMS().subscribe((ids) => {
      if (ids) {
        ids.forEach((id, index) => {
          // Hotfix: talk to backend to get a path/filename sent back
          const path = `sbom ${index}`;
          this.SVIPService.getSBOM(id as number).subscribe((sbom) => {
            this.files[path] = {
              status: FileStatus.VALID,
              id,
              type: sbom.format,
              fileName: path,
            };
            this.setContents(path);
          });
        });
      }
    });
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

  downloadSBOM(filePath: string) {
    const file = this.files[filePath]?.contents;
    if (file !== undefined) {
      return new Blob([file]);
    }
    return null;
  }

  GetAllFiles() {
    return Object.keys(this.files);
  }

  async AddFiles(paths: string[]) {
    paths.forEach((path) => {
      this.files[path] = {
        id: -1,
        status: FileStatus.LOADING,
      };
      this.SVIPService.getFileData(path).then((contents) => {
        if (contents) {
          this.SVIPService.uploadSBOM(path, contents).subscribe(
            (id) => {
              if (id) {
                this.SVIPService.getSBOM(id).subscribe((sbom) => {
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
    return this.files[path].type;
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
    this.SVIPService.compareSBOMs(idList).subscribe((result) => {
      this.comparison = result;
    });
  }

  /**
   * Delete file
   * @param: file ID
   */
  deleteFile(path: string) {
    const id = this.files[path].id
    // TODO: Add error handling for when file cannot be delted
    this.SVIPService.deleteSBOM(id).subscribe(() => delete this.files[id]);
  }

  ConvertSBOM(
    path: string,
    schema: string,
    format: string,
    overwrite: boolean
  ) {
    let sbom = this.files[path];
    let id = sbom.id ? sbom.id : -1;
      this.SVIPService.convertSBOM(id, schema, format, overwrite)
      .subscribe((result) => {
        if (result) {
          delete this.files[path].contents;
          if (this.files[path].id !== undefined) {
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
    this.SVIPService.getSBOMContents(sbom.id).subscribe((content) => {
      this.files[path].contents = JSON.stringify(content);
    });
    return this.files[path].contents;
  }
}

export interface File {
  fileName?: string;
  type: string;
  contents?: string;
  sbom?: SBOM;
  status?: FileStatus;
  id: number;

}


import { Injectable } from '@angular/core';
import { SVIPService } from './SVIP.service';

@Injectable({
  providedIn: 'root',
})
export class SbomService {
  private sbomFormats: { [name: string]: boolean } = {};
  public comparison: any;
  private files: { [id: number]: SBOMInfo } = {};

  constructor(private SVIPService: SVIPService) {}

  getAllSBOMs() {
    this.SVIPService.getSavedSBOMs().subscribe((ids) => {
      if (ids) {
        ids.forEach((id, index) => {
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
    this.SVIPService.compareSBOMs(idList).subscribe((result) => {
      this.comparison = result;
    });
  }

  /**
   * Delete file
   * @param: file ID
   */
  deleteFile(id: number) {
    // TODO: Add error handling for when file cannot be delted
    this.fileService.deleteSBOM(id).subscribe(() => delete this.files[id]);
  }

  ConvertSBOM(
    path: string,
    schema: string,
    format: string,
    overwrite: boolean
  ) {
    let sbom = this.files[id];
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
    this.getSBOMContents(sbom.id).subscribe((content) => {
      this.files[path].contents = JSON.stringify(content);
    });
    return this.files[path].contents;
  }
}

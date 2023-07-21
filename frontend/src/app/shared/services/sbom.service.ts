import { Injectable } from '@angular/core';
import { GENERATORS, SVIPService, generate } from './SVIP.service';
import File, { FileStatus } from '../models/file';

@Injectable({
  providedIn: 'root',
})
export class SbomService {
  private sbomSchemas: { [name: string]: boolean } = {};
  public comparison: any;
  private files: { [path: string]: File } = {};
  ids: number[] = [];

  constructor(private SVIPService: SVIPService) { }

  //#region functionality
  /**
   * Gets all SBOMS in database and sets up SBOM service
   */
  getAllSBOMs() {
    this.SVIPService.getSBOMS().subscribe((ids) => {
      if (ids) {
        this.ids = ids;
        ids.forEach((id) => {
          this.addSBOM(id);
        });
      }
    });
  }

  // Gets all new sboms from database
  fetch() {
    this.SVIPService.getSBOMS().subscribe((ids) => {
      if (ids) {
        const newIds = ids.filter((id) => this.ids.indexOf(id) === -1);
        newIds.forEach((id) => {
          this.addSBOM(id);
        });
      }
    });
  }

  private addSBOM(id: number, path?: string) {
    this.SVIPService.getSBOM(id as number).subscribe((sbom) => {
      // Hotfix: talk to backend to get a path/filename sent back
      const file = new File().setValid(
        id,
        path ? path : `sbom ${id}`,
        'n/a',
        sbom
      );
      this.files[file.fileName] = file;
      this.SetSBOMSchema(sbom.format, true);
      this.setContents(file.fileName);
    });
  }

  /**
   * Uploads files and checks to see if they are sboms
   * @param paths file paths
   */
  async AddFiles(paths: string[]) {
    paths.forEach((path) => {
      // File is loading
      this.files[path] = new File();
      this.SVIPService.getFileData(path).then((contents) => {
        if (contents) {
          this.SVIPService.uploadSBOM(path, contents).subscribe(
            (id) => {
              if (id) {
                // Successful upload
                this.SVIPService.getSBOM(id).subscribe((sbom) => {
                  this.files[path].setValid(id, path, contents, sbom);
                  this.SetSBOMSchema(sbom.format, true);
                });
              }
            },
            () => {
              // Failed upload
              this.files[path].setError();
            }
          );
        }
      });
    });
  }

  /**
   * Download SBOM file
   *
   */
  downloadSBOM(filePath: string): Blob {
    const file = this.files[filePath]?.contents;
    if (file !== null) {
      return new Blob([file]);
    }
    throw new Error('File does not exist!');
  }

  /**
   * Compare sboms
   * @param target target sbom, others will be tested against it
   * @param others sboms to compare against target
   */
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
    const id = this.files[path]?.id;
    if (id && id > -1) {
      // TODO: Add error handling for when file cannot be delted
      this.SVIPService.deleteSBOM(id).subscribe((deleted) => {
        if (deleted) {
          delete this.files[path];
        }
      });
    } else {
      delete this.files[path];
    }
  }

  generate(generator: GENERATORS,
    generateObj: generate) {
    const res = this.SVIPService.generateSBOM(
      generator,
      generateObj,
    );
    // Hotfix
    res.subscribe(res => {
      if (res) {
        console.log('gen');
        console.log(res);
        this.SVIPService.uploadSBOM(generateObj.projectName + '.spdx', JSON.stringify(res)).subscribe(end => {
          this.addSBOM(end, generateObj.projectName);
        })
      }
    });

    return res;
  }


  /**
   * Convert sbom from one type to another
   * @param path sbom path
   * @param schema sbom schema
   * @param format file format
   * @param overwrite overwrite or create new sbom
   */
  ConvertSBOM(
    path: string,
    schema: string,
    format: string,
    overwrite: boolean
  ) {
    let sbom = this.files[path];
    let id = sbom.id ? sbom.id : -1;
    // Hotfix while overwrite is flipped
    this.SVIPService.convertSBOM(id, schema, format, !overwrite).subscribe(
      (result) => {
        if (result && overwrite) {
          this.files[path].contents = result;
          this.files[path].schema = schema;
          this.files[path].format = format;
          this.SetSBOMSchema(schema, true);
        } else {
          this.fetch();
        }
      }
    );
  }
  //#endregion

  //#region SBOM schemas
  /**
   * Gets all SBOM schema helpers
   */
  getSBOMschemas() {
    return this.sbomSchemas;
  }

  /**
   * Set valid SBOM formats for filters
   * @param schema SBOM schema
   * @param value true if shown; false if filtered out
   */
  SetSBOMSchema(schema: string, value: boolean) {
    this.sbomSchemas[schema] = value;
  }

  /**
   * Gets schema of sbom
   * @param path sbom to check for
   */
  GetSBOMSchema(path: string) {
    return this.files[path].schema;
  }
  //#endregion

  //#region SBOM generic setters
  /**
   * Set file contents to match one stored in database
   * @param path sbom path to reset
   */
  setContents(path: string) {
    const sbom = this.files[path];
    // Hotfix: not returning as string for some reason
    this.SVIPService.getSBOMContents(sbom.id).subscribe((content) => {
      console.log(content);
      this.files[path].contents = content;
    });
    return this.files[path].contents;
  }
  //#endregion

  //#region SBOM generic Getters
  /**
   * Gets all SBOM file names
   */
  getSBOMNames() {
    return Object.keys(this.files);
  }

  /**
   * Gets sbom file
   * @param path sbom path
   */
  GetSBOMInfo(path: string) {
    return this.files[path];
  }

  /**
   * Gets SBOMS matching requested status
   * @param status file status
   */
  GetSBOMsOfStatus(status: FileStatus) {
    return Object.keys(this.files).filter(
      (x) => this.files[x].status === status
    );
  }

  /**
   * Gets sbom file name without the path
   * @param path sbom path
   */
  getSBOMAlias(path: string) {
    const pathChar = path.indexOf('/') !== -1 ? '/' : '\\';
    return path.split(pathChar).pop();
  }

  //#endregion
}

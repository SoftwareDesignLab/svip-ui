import { Injectable } from '@angular/core';
import { SVIPService } from './SVIP.service';
import File, { FileStatus } from '../models/file';

@Injectable({
  providedIn: 'root',
})
export class SbomService {
  private sbomSchemas: { [name: string]: boolean } = {};
  public comparison: any;
  private files: { [path: string]: File } = {};

  constructor(private SVIPService: SVIPService) {}

  /**
   * Gets all SBOMS in database and sets up SBOM service
   */
  getAllSBOMs() {
    this.SVIPService.getSBOMS().subscribe((ids) => {
      if (ids) {
        ids.forEach((id, index) => {
          // Hotfix: talk to backend to get a path/filename sent back
          const path = `sbom ${index}`;
          this.SVIPService.getSBOM(id as number).subscribe((sbom) => {
            const file = new File();
            file.setValid(id, path, 'n/a', sbom);
            this.files[path] = file;
            this.setContents(path);
          });
        });
      }
    });
  }

  /**
   * Gets all SBOM schemas
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
   * Gets all SBOM file names
   */
  getSBOMNames() {
    return Object.keys(this.files);
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
   * Gets SBOMS matching requested status
   * @param status file status
   */
  GetSBOMsOfStatus(status: FileStatus) {
    return Object.keys(this.files).filter(
      (x) => this.files[x].status === status
    );
  }

  /**
   * Gets schema of sbom
   * @param path sbom to check for
   */
  GetSBOMSchema(path: string) {
    return this.files[path].schema;
  }

  GetSBOMInfo(path: string) {
    return this.files[path];
  }

  ContainsSBOMSchema(schema: string) {
    return this.sbomSchemas[schema] !== undefined;
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
    const id = this.files[path].id;
    if (id > 0) {
      this.SVIPService.deleteSBOM(id);
    }
    // TODO: Add error handling for when file cannot be delted
    delete this.files[path];
  }

  ConvertSBOM(
    path: string,
    schema: string,
    format: string,
    overwrite: boolean
  ) {
    let sbom = this.files[path];
    let id = sbom.id ? sbom.id : -1;
    this.SVIPService.convertSBOM(id, schema, format, overwrite).subscribe(
      (result) => {
        if (result) {
          this.files[path].contents = result;
          if (this.files[path].id !== undefined) {
            this.files[path].id += 1;
          }
          this.setContents(path);
          this.files[path].schema = schema;
        }
      }
    );
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

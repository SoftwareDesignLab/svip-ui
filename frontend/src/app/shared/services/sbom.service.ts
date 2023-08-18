import { Injectable } from '@angular/core';
import { SVIPService } from './SVIP.service';
import { PAGES, RoutingService } from './routing.service';
import File, { FileStatus } from '../models/file';

@Injectable({
  providedIn: 'root',
})
export class SbomService {
  private sbomSchemas: { [name: string]: boolean } = {};
  private sbomFormat: { [name: string]: boolean } = {};
  public comparison: any;
  private files: { [path: string]: File } = {};

  constructor(
    private SVIPService: SVIPService,
    private routingService: RoutingService
  ) {}

  //#region functionality

  /**
   * Gets sbom by ID
   * @param getSBOM by ID
   */
  addSBOMbyID(id: number) {
    this.SVIPService.getSBOM(id as number).subscribe((sbom) => {
      this.SVIPService.getSBOMContents(id as number).subscribe((data: any) => {
        let path = data.fileName;
        let contents = data.contents;

        const file = new File(path).setValid(id, contents, sbom);
        this.files[path] = file;
        this.SetSBOMFormat(sbom.format, true);

        console.log(this.files);
      });
    });
  }

  /**
   * Gets all SBOMS in database and sets up SBOM service
   */
  getAllSBOMs() {
    this.SVIPService.getSBOMS().subscribe((ids) => {
      if (ids) {
        ids.forEach((id) => this.addSBOMbyID(id));
      }
    });
  }

  /**
   * Uploads files and checks to see if they are sboms
   * @param paths file paths
   */
  async AddFiles(paths: string[]) {
    paths.forEach((path) => {
      // File is loading
      this.files[path] = new File(path);
      this.SVIPService.getFileData(path).then((contents) => {
        if (contents) {
          this.SVIPService.uploadSBOM(path, contents).subscribe(
            (id) => {
              if (id) {
                // Successful upload
                this.SVIPService.getSBOM(id).subscribe((sbom) => {
                  this.files[path].setValid(id, contents, sbom);
                  this.SetSBOMFormat(sbom.format, true);
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
          const data = this.routingService.data;
          if (data === id || data === path) {
            this.routingService.data = null;
            this.routingService.SetPage(PAGES.NONE);
          }
          delete this.files[path];
        }
      });
    } else {
      delete this.files[path];
    }
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
    this.SVIPService.convertSBOM(id, schema, format, overwrite).subscribe(
      (result) => {
        if (result) {
          this.files[path].contents = JSON.stringify(result, null, '2');
          this.files[path].id += 1;
          this.files[path].schema = schema;
          this.files[path].format = format;
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

  //#region SBOM format
  /**
   * Gets all SBOM format helpers
   */
  getSBOMformat(){
    return this.sbomFormat;
  }

  /**
   * Set valid SBOM formats for filters
   * @param format SBOM format
   * @param value true if shown; false if filtered out
   */
  SetSBOMFormat(format: string, value: boolean) {
    this.sbomFormat[format] = value;
  }

  /**
   * Gets schema of sbom
   * @param path sbom to check for
   */
  GetSBOMFormat(path: string) {
    return this.files[path].format;
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
    const lastSlashIndex = path.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      const filename = path.substring(lastSlashIndex + 1);

      const cleanFilename = filename.replace(/[^a-zA-Z0-9._]/g, '');

      return cleanFilename;
    }
    return path;
  }


  //#endregion
}

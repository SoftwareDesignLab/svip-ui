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
  private files: { [id: string]: File } = {};

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
        this.files[id] = file;
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
      let randomID = Math.random().toString();
      // File is loading
      this.files[randomID] = new File(path);
      this.SVIPService.getFileData(path).then((contents) => {
        if (contents) {
          this.SVIPService.uploadSBOM(path, contents).subscribe(
            (id) => {
              if (id) {
                // Successful upload
                this.SVIPService.getSBOM(id).subscribe((sbom) => {
                  delete this.files[randomID];
                  let file = new File(path).setValid(id, contents, sbom);
                  this.files[id] = file;
                  this.SetSBOMFormat(sbom.format, true);
                });
              }
            },
            () => {
              // Failed upload
              this.files[randomID].setError();
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
  downloadSBOM(id: string): Blob {
    const file = this.files[id]?.contents;
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
  deleteFile(id: string) {
    if (id && Number(id) > -1) {
      // TODO: Add error handling for when file cannot be delted
      this.SVIPService.deleteSBOM(Number(id)).subscribe((deleted) => {
        if (deleted) {
          const data = this.routingService.data;
          if (data === id) {
            this.routingService.data = null;
            this.routingService.SetPage(PAGES.NONE);
          }
          delete this.files[id];
        }
      });
    } else {
      delete this.files[id];
    }
  }

  /**
   * Convert sbom from one type to another
   * @param id sbom id
   * @param schema sbom schema
   * @param format file format
   * @param overwrite overwrite or create new sbom
   */
  ConvertSBOM(
    id: string,
    schema: string,
    format: string,
    overwrite: boolean
  ) {
    let sbom = this.files[id];
    this.SVIPService.convertSBOM(Number(id), schema, format, overwrite).subscribe(
      (result) => {
        if (result) {
          this.files[id].contents = JSON.stringify(result, null, '2');
          this.files[id].id += 1;
          this.files[id].schema = schema;
          this.files[id].format = format;
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
   * @param id sbom to check for
   */
  GetSBOMSchema(id: string) {
    return this.files[id].schema;
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
   * @param id sbom to check for
   */
  GetSBOMFormat(id: string) {
    return this.files[id].format;
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
   * @param id sbom id
   */
  GetSBOMInfo(id: string) {
    return this.files[id];
  }

  /**
   * Gets SBOMS matching requested status
   * @param status file status
   */
  GetSBOMsOfStatus(status: FileStatus) {
    return Object.keys(this.files).filter(
      (x: any) => this.files[x].status === status
    );
  }

  /**
   * Gets sbom file name without the path
   * @param path sbom path
   */
  getSBOMAlias(id: string) {
    let path = this.files[id].fileName;
    const lastBackslashIndex = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  
    if (lastBackslashIndex !== -1) {
      return path.substring(lastBackslashIndex + 1); 
    }
    return path;
  }


  //#endregion
}

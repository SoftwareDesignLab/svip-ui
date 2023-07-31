/**@author Justin Jantzi, Tina DiLorenzo*/

import { Injectable } from '@angular/core';
import { ClientService } from './client.service';
import { IpcRenderer } from 'electron';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { SBOM } from '../models/sbom';

@Injectable({
  providedIn: 'root',
})
export class SVIPService {
  private ipc!: IpcRenderer;

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

  //#region SVIP functions
  /**
   * Upload an SBOM in the database for future use
   * @param fileName File name
   * @param contents contents of the sbom
   */
  uploadSBOM(fileName: string, contents: string): Observable<number> {
    return this.client.post('sboms', {
      contents: contents,
      fileName: fileName,
    }) as Observable<number>;
  }

  /**
   * Get an SBOM in the database
   * @param id SBOM id
   */
  getSBOM(id: number): Observable<SBOM> {
    const params = new HttpParams().set('id', id);
    return this.client.get('sbom', params) as Observable<SBOM>;
  }

  /**
   * Get an SBOM's file contents
   * @param id SBOM id
   */
  getSBOMContents(id: number): Observable<object> {
    return this.client.get('sboms/content', new HttpParams().set('id', id));
  }

  /**
   * Get all sboms IDs in database
   */
  getSBOMS(): Observable<number[]> {
    return this.client.get('sboms') as Observable<number[]>;
  }

  /**
   * Delete an  SBOM in the database
   * @param id SBOM id
   */
  deleteSBOM(id: number): Observable<object> {
    return this.client.delete('sboms', new HttpParams().set('id', id));
  }

  /**
   * Delete an  SBOM in the database
   * @param id SBOM id
   */
  compareSBOMs(ids: number[]) {
    return this.client.get(
      'compare',
      new HttpParams().set('Ids', JSON.stringify(ids)).set('targetIndex', 0)
    );
  }

  /**
   * Merge SBOMs into one SBOM
   * @param ids ids of sboms to merge
   */
  mergeSBOMs(ids: number[]): Observable<number> {
    return this.client.post('sboms/merge', ids) as Observable<number>;
  }

  /**
   * Convert an  SBOM to a new format or schema.
   * @param id SBOM id
   * @param schema SBOM schema
   * @param format SBOM format
   * @param overwrite if false, a new sbom will be crated; else overwritten.
   */
  convertSBOM(
    id: number,
    schema: string,
    format: string,
    overwrite: boolean
  ): Observable<string> {
    return this.client.put(
      'sboms',
      new HttpParams()
        .set('id', id)
        .set('schema', schema)
        .set('format', format)
        .set('overwrite', overwrite)
    ) as Observable<string>;
  }

  getVex(id: number, format: string, database: string, apiKey: string = '') {
    if (apiKey) this.client.setAPIKey(apiKey);

    return this.client.get(
      'sboms/vex',
      new HttpParams()
        .set('id', id)
        .set('format', format)
        .set('client', database)
    ) as Observable<any>;
  }

  /**
   *  Run metrics on an SBOM.
   * @param id SBOM id
   */
  gradeSBOM(id: number): Observable<string> {
    return this.client.get(
      'sboms/qa',
      new HttpParams().set('id', id)
    ) as Observable<string>;
  }
  //#endregion
  //#region Electron
  /**
   *  Get file information from filepath
   * @param path File path
   */
  getFileData(path: string) {
    return this.ipc.invoke('getFileData', path);
  }

  /**
   * Open file explorer and prompts user to upload fiels
   * @param id SBOM id
   */
  browseFiles() {
    return this.ipc.invoke('selectFiles');
  }
  //#endregion
}

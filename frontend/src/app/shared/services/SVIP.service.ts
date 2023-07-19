/**@author Justin Jantzi, Tina DiLorenzo*/

import { Injectable } from '@angular/core';
import { ClientService } from './client.service';
import { IpcRenderer } from 'electron';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { SBOM } from '../models/sbom';

@Injectable({
  providedIn: 'root',
})
export class SVIPService {
  private ipc!: IpcRenderer;

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

  /**
   * Upload an SBOM in the database for future use
   * @param fileName File name
   * @param contents contents of the sbom
   */
  uploadSBOM(fileName: string, contents: string): Observable<number> {
    return this.client.post('upload', {
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
    return this.client.get('getSBOM', params) as Observable<SBOM>;
  }

  /**
   * Get an SBOM's file contents
   * @param id SBOM id
   */
  getSBOMContents(id: number): Observable<object> {
    return this.client.get('view', new HttpParams().set('id', id));
  }

  /**
   * Get all sboms IDs in database
   */
  getSBOMS(): Observable<number[]> {
    return this.client.get('viewFiles') as Observable<number[]>;
  }

  /**
   * Delete an  SBOM in the database
   * @param id SBOM id
   */
  deleteSBOM(id: number): Observable<object> {
    return this.client.delete('delete', new HttpParams().set('id', id));
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
   * Convert an  SBOM to a new format or schema.
   *  Resulting SBOM will have a new id, overwritten or not
   * @param id SBOM id
   */
  convertSBOM(id: number, schema: string, format: string, overwrite: boolean): Observable<string> {
    return this.client.get(
      'convert',
      new HttpParams()
        .set('id', id)
        .set('schema', schema)
        .set('format', format)
        .set('overwrite', overwrite)
    ) as Observable<string>;
  }
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

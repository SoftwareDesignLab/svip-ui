import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor() { }

  Download(fileName: string, content: Blob) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();

    window.URL.revokeObjectURL(url);
  }

  DownloadAsZip(files: {[key: string]: string}) {
    const zip = new JSZip();

    let keys = Object.keys(files);

    for(let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let contents = files[key];

      zip.file(key, contents);
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, 'files.zip');
  });
  }
}

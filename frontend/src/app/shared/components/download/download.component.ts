import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent {
  constructor(private http: HttpClient) { }

  downloadFile() {
    const fileURL = 'https://drive.google.com/file/d/1edySpAxJd3MosWrP5x1_VKaZGua4yuUm/view?usp=drive_link';

    this.http.get(fileURL, {
      responseType: 'blob',
    })
      .subscribe((response: Blob) => {
        const fileURL = URL.createObjectURL(response);

        const link = document.createElement('a');
        link.href = fileURL;

        link.download = 'file.pdf';

        link.click();
    });
  }
}

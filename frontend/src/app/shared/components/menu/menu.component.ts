import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataHandlerService } from '../../services/data-handler.service';
import { PAGES, RoutingService } from '../../services/routing.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  @Input() text: string = '';
  @Input() data: string= '';

  constructor(public routing: RoutingService, private dataHandler: DataHandlerService) {
  }

  RemoveFile() {
    this.dataHandler.DeleteFile(this.data);
  }

  GetSBOMInfo(file: string) {
    return this.dataHandler.GetSBOMInfo(file);
  }

  DownloadOne() {
    const name = this.GetSBOMInfo(this.data).fileName;
    const sbom = this.dataHandler.downloadSBOM(this.data);
    if( sbom ) {
    const url = URL.createObjectURL(sbom);
    const link = document.createElement('a')
    link.href = url;
    link.download = JSON.stringify(name);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    }
}
}
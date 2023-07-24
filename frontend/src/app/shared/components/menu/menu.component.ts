import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PAGES, RoutingService } from '../../services/routing.service';
import { SbomService } from '../../services/sbom.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  @Input() text: string = '';
  @Input() data: string= '';

  constructor(public routing: RoutingService, private sbomService: SbomService) {
  }

  RemoveFile() {
    this.sbomService.deleteFile(this.data);
  }

  GetSBOMInfo(file: string) {
    return this.sbomService.GetSBOMInfo(file);
  }

  DownloadOne() {
    const name = this.GetSBOMInfo(this.data).fileName;
    const sbom = this.sbomService.downloadSBOM(this.data);
    if( sbom ) {
    const url = URL.createObjectURL(sbom);
    const link = document.createElement('a')
    link.href = url;
    link.download = name as string;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    }
}
}
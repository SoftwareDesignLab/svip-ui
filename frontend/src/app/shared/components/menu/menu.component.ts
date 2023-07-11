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
  public deleteModal: boolean = false;


  constructor(public routing: RoutingService, private dataHandler: DataHandlerService) {
  }

  /**
   * Removes file from uploaded files
   * @param file file to remove
   */
  RemoveFile(file: string) {

    if (this.routing.GetPage() === PAGES.VIEW && this.routing.data === file) {
      this.routing.SetPage(PAGES.NONE);
      this.routing.data = undefined;
    }

    this.dataHandler.DeleteFile(file);
  }


  GetSelected() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let selected: string[] = [];

    for (let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i] as HTMLInputElement;
      if (checkbox.checked && !checkbox.disabled) {
        selected.push(checkbox.value);
      }
    }

    return selected;
  }

  DeleteSelected() {
    this.GetSelected().forEach((file) => {
      this.RemoveFile(file);
    })

    this.deleteModal = false;
  }

  DownloadSelected() {
    this.GetSelected().forEach((file) => {
      const sbom = this.dataHandler.downloadSBOM(file);
      if( sbom ) {
      const url = URL.createObjectURL(sbom);
      const link = document.createElement('a')
      link.href = url;
      link.download = sbom.name;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      }
    })
  }
}

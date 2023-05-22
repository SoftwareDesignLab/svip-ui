import { Component, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataHandlerService } from 'src/app/shared/services/data-handler.service';

@Component({
  selector: 'app-metrics-side-panel',
  templateUrl: './metrics-side-panel.component.html',
  styleUrls: ['./metrics-side-panel.component.css']
})
export class MetricsSidePanelComponent {
  sbomInfoOpened: string | null = null;
  modalRef: NgbModalRef | undefined;

  constructor(private handler: DataHandlerService, public modalService: NgbModal) {}

  GetSBOMs() {
    return this.handler.GetValidSBOMs();
  }

  SetSelectedSBOM(bom: string) {
    this.handler.selectedQualityReport = bom;
  }

  getSBOMAlias(path: string) {
    return this.handler.getSBOMAlias(path);
  }

  getSBOMInfo(path: string) {
    this.sbomInfoOpened = path;
  }

  openModal() {
    if (this.sbomInfoOpened) {
      const sbomAlias = this.getSBOMAlias(this.sbomInfoOpened);
      this.modalRef = this.modalService.open('modal');
      const modalInstance = this.modalRef.componentInstance;
      modalInstance.title = 'SBOM DETAILS';
      modalInstance.content = sbomAlias;
    }
  }
}

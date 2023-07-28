import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SVIPService } from 'src/app/shared/services/SVIP.service';
import { SbomService } from 'src/app/shared/services/sbom.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-merge-modal',
  templateUrl: './merge-modal.component.html',
  styleUrls: ['./merge-modal.component.css'],
})
export class MergeModalComponent {
  @Input() opened!: boolean;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() sboms!: string[];

  constructor(
    private sbomService: SbomService,
    private SVIPService: SVIPService,
    private toastService: ToastService
  ) {}

  merge() {
    const ids: number[] = [];
    this.sboms.forEach((sbom) => {
      const id = this.sbomService.GetSBOMInfo(sbom).id;
      ids.push(id);
    });

    this.SVIPService.mergeSBOMs(ids).subscribe(
      (id) => {
        if (id) {
          this.sbomService.addSBOMbyID(id);
        }
      },
      (error) => {
        this.toastService.showErrorToast('ERROR', error.message);
      }
    );
    this.Close();
  }

  Close() {
    this.close.emit(false);
  }
}

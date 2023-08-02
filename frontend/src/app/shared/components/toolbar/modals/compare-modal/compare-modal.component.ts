import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoutingService } from 'src/app/shared/services/routing.service';
import { SbomService } from 'src/app/shared/services/sbom.service';

@Component({
  selector: 'app-compare-modal',
  templateUrl: './compare-modal.component.html',
  styleUrls: ['./compare-modal.component.css']
})
export class CompareModalComponent {
  protected compareTarget: string = '';
  @Input() opened: boolean = false;
  @Output() close = new EventEmitter<Boolean>();

  constructor(private sbomService: SbomService, public routing: RoutingService) {}

  GetSelected() {
    const checkboxes = document.querySelectorAll('.sbom-checkbox');
    let selected: string[] = [];

    for (let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i] as HTMLInputElement;
      if (checkbox.checked && !checkbox.disabled && checkbox.value != 'null') {
        selected.push(this.getAlias(checkbox.value) as string);
      }
    }

    return selected;
  }

  CompareSelected() {
    this.routing.SetPage(2);

    let others = this.GetSelected().filter((x) => x !== this.compareTarget);
    this.sbomService.CompareSBOMs(this.compareTarget, others);
    this.Close();
  }

  Close() {
    this.close.emit(true);
  }

  getAlias(sbom: string) {
    return this.sbomService.getSBOMAlias(sbom)?.split('.')[0];
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import palettes, { PALETTE } from '../palettes';
import attribute from '../attributes';

@Component({
  selector: 'app-qa-filters',
  templateUrl: './qa-filters.component.html',
  styleUrls: ['./qa-filters.component.css'],
})
export class QaFiltersComponent implements OnInit {
  palettes = palettes;
  @Input() attributes!: attribute;
  @Output() attributesChange = new EventEmitter<attribute>();
  accessibilityModal = false;
  selectedPalette!: PALETTE;
  @Input() palette!: PALETTE;
  @Output() paletteChange = new EventEmitter<PALETTE>();

  constructor() {}

  ngOnInit() {
    this.selectedPalette = this.palette;
  }

  selectPalette(palette: string) {
    const _palette = palette as unknown as PALETTE;
    this.selectedPalette = _palette;
  }

  setPalette() {
    this.palette = this.selectedPalette;
    this.paletteChange.emit(this.palette);
  }
}

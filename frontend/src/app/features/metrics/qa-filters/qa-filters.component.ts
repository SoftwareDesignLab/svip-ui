import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import palettes, { PALETTES } from '../palettes';

@Component({
  selector: 'app-qa-filters',
  templateUrl: './qa-filters.component.html',
  styleUrls: ['./qa-filters.component.css'],
})
export class QaFiltersComponent implements OnInit {
  palettes = palettes;
  @Input() attributes: {
    [ProcessorName: string]: { color: string; shown: boolean };
  } = {};
  accessibilityModal = false;
  selectedPalette!: PALETTES;
  @Input() palette!: PALETTES;
  @Output() paletteChange = new EventEmitter<PALETTES>();


  constructor() {}

  ngOnInit() {
    this.selectedPalette = this.palette;
  }

  selectPalette(palette: string) {
    this.selectedPalette = PALETTES[palette as keyof typeof PALETTES];
  }

  setPalette() {
    this.palette = this.selectedPalette;
    this.paletteChange.emit(this.palette);
  }
}

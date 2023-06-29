import { Component } from '@angular/core';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent {
  files: File[] = [];

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    this.handleFiles(files);
  }

  handleFiles(files: FileList | null): void {
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.files.push(files[i]);
      }
    }
  }
}
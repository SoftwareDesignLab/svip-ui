import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { UploadComponent } from './features/upload/upload.component';
import { ViewerComponent } from './shared/components/viewer/viewer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ToggleComponent } from './shared/components/toggle/toggle.component';
import { MultiselectDropdownComponent } from './shared/components/multiselect-dropdown/multiselect-dropdown.component';
import { ModalComponent } from './shared/components/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    UploadComponent,
    ViewerComponent,
    NavbarComponent,
    ToggleComponent,
    MultiselectDropdownComponent,
    ModalComponent
  ],
  imports: [BrowserModule, NgbModule, HttpClientModule, NgbTooltipModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { UploadComponent } from './features/upload/upload.component';
import { ViewComponent } from './features/view/view.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ToggleComponent } from './shared/components/toggle/toggle.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { MultiselectDropdownComponent } from './shared/components/multiselect-dropdown/multiselect-dropdown.component';
import { MenuComponent } from './shared/components/menu/menu.component';
import { AccordionComponent } from './shared/components/accordion/accordion.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ComparisonComponent } from './features/comparison/comparison.component';
import { ViewerComponent } from './shared/components/viewer/viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    UploadComponent,
    ViewComponent,
    NavbarComponent,
    ToggleComponent,
    MultiselectDropdownComponent,
    AccordionComponent,
    MenuComponent,
    ModalComponent,
    ToastComponent,
    ComparisonComponent,
    ViewerComponent
  ],
  imports: [BrowserModule, NgbModule, HttpClientModule, NgbTooltipModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

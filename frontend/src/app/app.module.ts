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
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { ToasterComponent } from './shared/components/toaster/toaster.component';
>>>>>>> b6dfe1f32791f805435c8ae428bed03f05ef6abd
import { CompareModalComponent } from './shared/components/toolbar/modals/compare-modal/compare-modal.component'
import { ConvertModalComponent } from './shared/components/toolbar/modals/convert-modal/convert-modal.component';
import { DeleteModalComponent } from './shared/components/toolbar/modals/delete-modal/delete-modal.component';
import { ViewerComponent } from './shared/components/viewer/viewer.component';
=======
import { ToasterComponent } from './shared/components/toaster/toaster.component';
>>>>>>> bf7c7cf (adding toaster service)

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
<<<<<<< HEAD
<<<<<<< HEAD
=======
    ToasterComponent,
>>>>>>> b6dfe1f32791f805435c8ae428bed03f05ef6abd
    CompareModalComponent,
    ConvertModalComponent,
    DeleteModalComponent,
    ViewerComponent
=======
    ToasterComponent
>>>>>>> bf7c7cf (adding toaster service)
  ],
  imports: [BrowserModule, NgbModule, HttpClientModule, NgbTooltipModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

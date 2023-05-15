import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ButtonComponent } from './shared/components/button/button.component';
import { ManageSbomsPageComponent } from './features/manage-sboms/manage-sboms-page/manage-sboms-page.component';

@NgModule({
  declarations: [AppComponent, ButtonComponent, ManageSbomsPageComponent],
  imports: [BrowserModule, NgbModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ButtonComponent } from './shared/components/button/button.component';
import { ManageSbomsPageComponent } from './features/manage-sboms/manage-sboms-page/manage-sboms-page.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';

@NgModule({
  declarations: [AppComponent, ButtonComponent, ManageSbomsPageComponent, SpinnerComponent],
  imports: [BrowserModule, NgbModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

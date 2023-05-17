import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ButtonComponent } from './shared/components/button/button.component';
import { ManageSbomsPageComponent } from './features/manage-sboms/manage-sboms-page.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { ComparePageComponent } from './features/compare/compare-page/compare-page.component';
import { CompareSidepanelComponent } from './features/compare/compare-sidepanel/compare-sidepanel.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    ManageSbomsPageComponent,
    SpinnerComponent,
    ComparePageComponent,
    CompareSidepanelComponent,
  ],
  imports: [BrowserModule, NgbModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

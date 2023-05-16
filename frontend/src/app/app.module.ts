import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ButtonComponent } from './shared/components/button/button.component';
import { AccordionComponent } from './shared/components/accordion/accordion.component';
import { SidePanelComponent } from './shared/components/side-panel/side-panel.component';
import { ManageSbomsPageComponent } from './features/manage-sboms/manage-sboms-page.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { MetricsSidePanelComponent } from './features/metrics/metrics-side-panel/metrics-side-panel.component';
import { MetricsBodyComponent } from './features/metrics/metrics-body/metrics-body.component';
import { MetricsMainComponent } from './features/metrics/metrics-main/metrics-main.component';

@NgModule({
  declarations: [
    AppComponent, 
    ButtonComponent, 
    ManageSbomsPageComponent, 
    SpinnerComponent, 
    MetricsSidePanelComponent, 
    MetricsBodyComponent, 
    MetricsMainComponent, 
    AccordionComponent, 
    SidePanelComponent,
  ],
  imports: [
    BrowserModule,  
    NgbModule, 
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

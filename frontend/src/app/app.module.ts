import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { AccordionComponent } from './shared/components/accordion/accordion.component';
import { SidePanelComponent } from './shared/components/side-panel/side-panel.component';
import { ManageSbomsPageComponent } from './features/manage-sboms/manage-sboms-page.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { ComparePageComponent } from './features/compare/compare-page/compare-page.component';
import { CompareSidepanelComponent } from './features/compare/compare-sidepanel/compare-sidepanel.component';
import { ComparisonComponent } from './features/compare/comparison/comparison.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { HomeComponent } from './features/home/home.component';
import { MetricsSidePanelComponent } from './features/metrics/metrics-side-panel/metrics-side-panel.component';
import { MetricsBodyComponent } from './features/metrics/metrics-body/metrics-body.component';
import { MetricsMainComponent } from './features/metrics/metrics-main/metrics-main.component';
import { AppRoutingModule } from './app-routing.module';
import { ModalComponent } from './shared/components/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    ManageSbomsPageComponent,
    SpinnerComponent,
    ComparisonComponent,
    ComparePageComponent,
    CompareSidepanelComponent,
    MetricsSidePanelComponent,
    MetricsBodyComponent,
    MetricsMainComponent,
    AccordionComponent,
    SidePanelComponent,
    NavbarComponent,
    HomeComponent,
    ModalComponent,
  ],
  imports: [BrowserModule, NgbModule, HttpClientModule, AppRoutingModule, NgbTooltipModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

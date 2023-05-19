import { NgModule } from '@angular/core';
import { ManageSbomsPageComponent } from './features/manage-sboms/manage-sboms-page.component';
import { HomeComponent } from './features/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { MetricsMainComponent } from './features/metrics/metrics-main/metrics-main.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'manage', component: ManageSbomsPageComponent },
  {path: 'metrics', component:  MetricsMainComponent},
  { path: '**', component: HomeComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

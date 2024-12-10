import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkerComponent } from './marker.component';

const routes: Routes = [{ path: '', component: MarkerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarkerRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkerPannelComponent } from './marker-pannel.component';

const routes: Routes = [{ path: '', component: MarkerPannelComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarkerPannelRoutingModule { }

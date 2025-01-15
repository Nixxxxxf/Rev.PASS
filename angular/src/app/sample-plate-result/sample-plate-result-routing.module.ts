import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SamplePlateResultComponent } from './sample-plate-result.component';

const routes: Routes = [{ path: '', component: SamplePlateResultComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SamplePlateResultRoutingModule { }

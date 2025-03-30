import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GradientDilutionComponent } from './gradient-dilution.component';

const routes: Routes = [{ path: '', component: GradientDilutionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradientDilutionRoutingModule { }

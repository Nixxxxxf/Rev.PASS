import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneComponent } from './gene.component';

const routes: Routes = [{ path: '', component: GeneComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneRoutingModule { }

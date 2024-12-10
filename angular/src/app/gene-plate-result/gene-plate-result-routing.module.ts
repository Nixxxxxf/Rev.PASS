import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenePlateResultComponent } from './gene-plate-result.component';

const routes: Routes = [{ path: '', component: GenePlateResultComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenePlateResultRoutingModule { }

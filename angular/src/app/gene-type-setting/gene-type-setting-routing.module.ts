import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneTypeSettingComponent } from './gene-type-setting.component';

const routes: Routes = [{ path: '', component: GeneTypeSettingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneTypeSettingRoutingModule { }

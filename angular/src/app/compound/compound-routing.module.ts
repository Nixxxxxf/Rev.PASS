import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompoundComponent } from './compound.component';

const routes: Routes = [{ path: '', component: CompoundComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompoundRoutingModule { }

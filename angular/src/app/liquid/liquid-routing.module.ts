import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidComponent } from './liquid.component';

const routes: Routes = [{ path: '', component: LiquidComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidRoutingModule { }

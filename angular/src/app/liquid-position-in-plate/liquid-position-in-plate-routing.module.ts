import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidPositionInPlateComponent } from './liquid-position-in-plate.component';

const routes: Routes = [{ path: '', component: LiquidPositionInPlateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidPositionInPlateRoutingModule { }

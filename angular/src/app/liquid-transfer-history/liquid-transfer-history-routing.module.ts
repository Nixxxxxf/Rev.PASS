import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidTransferHistoryComponent } from './liquid-transfer-history.component';

const routes: Routes = [{ path: '', component: LiquidTransferHistoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidTransferHistoryRoutingModule { }

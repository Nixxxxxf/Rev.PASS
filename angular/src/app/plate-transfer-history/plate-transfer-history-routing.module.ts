import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlateTransferHistoryComponent } from './plate-transfer-history.component';

const routes: Routes = [{ path: '', component: PlateTransferHistoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlateTransferHistoryRoutingModule { }

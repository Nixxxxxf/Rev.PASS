import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlateTransferHistoryRoutingModule } from './plate-transfer-history-routing.module';
import { PlateTransferHistoryComponent } from './plate-transfer-history.component';
import { SharedModule } from '../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TabViewModule } from 'primeng/tabview';
import { TimespanPipe } from '../shared/timespan.pipe';


@NgModule({
  declarations: [
    PlateTransferHistoryComponent,
    TimespanPipe,
  ],
  imports: [
    SharedModule,
    ButtonModule,
    AutoCompleteModule,
    TabViewModule,
    PlateTransferHistoryRoutingModule,
  ]
})
export class PlateTransferHistoryModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiquidTransferHistoryRoutingModule } from './liquid-transfer-history-routing.module';
import { LiquidTransferHistoryComponent } from './liquid-transfer-history.component';
import { SharedModule } from '../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TabViewModule } from 'primeng/tabview';



@NgModule({
  declarations: [
    LiquidTransferHistoryComponent
  ],
  imports: [
    SharedModule,
    LiquidTransferHistoryRoutingModule,
    ButtonModule,
    AutoCompleteModule,
    TabViewModule,
  ]
})
export class LiquidTransferHistoryModule { }

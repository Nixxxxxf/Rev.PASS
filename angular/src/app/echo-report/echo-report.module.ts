import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EchoReportRoutingModule } from './echo-report-routing.module';
import { EchoReportComponent } from './echo-report.component';
import { SharedModule } from '../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TabViewModule } from 'primeng/tabview';


@NgModule({
  declarations: [
    EchoReportComponent
  ],
  imports: [
    SharedModule,
    EchoReportRoutingModule,
    ButtonModule,
    AutoCompleteModule,
    TabViewModule,
  ]
})
export class EchoReportModule { }

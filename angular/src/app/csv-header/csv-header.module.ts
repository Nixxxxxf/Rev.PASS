import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CsvHeaderRoutingModule } from './csv-header-routing.module';
import { CsvHeaderComponent } from './csv-header.component';
import { SharedModule } from '../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TabViewModule } from 'primeng/tabview';



@NgModule({
  declarations: [
    CsvHeaderComponent
  ],
  imports: [
    SharedModule,
    ButtonModule,
    AutoCompleteModule,
    TabViewModule,
    CsvHeaderRoutingModule
  ]
})
export class CsvHeaderModule { }

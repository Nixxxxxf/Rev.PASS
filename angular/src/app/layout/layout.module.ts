import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SharedModule } from '../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TabViewModule } from 'primeng/tabview';

@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    SharedModule,
    LayoutRoutingModule,
    ButtonModule,
    AutoCompleteModule,
    TabViewModule,
  ]
})
export class LayoutModule { }

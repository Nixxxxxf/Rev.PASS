import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneTypeSettingRoutingModule } from './gene-type-setting-routing.module';
import { GeneTypeSettingComponent } from './gene-type-setting.component';


@NgModule({
  declarations: [
    GeneTypeSettingComponent
  ],
  imports: [
    CommonModule,
    GeneTypeSettingRoutingModule
  ]
})
export class GeneTypeSettingModule { }

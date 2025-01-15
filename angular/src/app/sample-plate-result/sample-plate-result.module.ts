import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamplePlateResultRoutingModule } from './sample-plate-result-routing.module';
import { SamplePlateResultComponent } from './sample-plate-result.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    SamplePlateResultComponent
  ],
  imports: [
    SharedModule,
    SamplePlateResultRoutingModule
  ]
})
export class SamplePlateResultModule { }

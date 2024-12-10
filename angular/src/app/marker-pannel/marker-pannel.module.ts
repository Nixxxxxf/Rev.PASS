import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkerPannelRoutingModule } from './marker-pannel-routing.module';
import { MarkerPannelComponent } from './marker-pannel.component';


@NgModule({
  declarations: [
    MarkerPannelComponent
  ],
  imports: [
    CommonModule,
    MarkerPannelRoutingModule
  ]
})
export class MarkerPannelModule { }

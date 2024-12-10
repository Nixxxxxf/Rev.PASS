import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkerRoutingModule } from './marker-routing.module';
import { MarkerComponent } from './marker.component';


@NgModule({
  declarations: [
    MarkerComponent
  ],
  imports: [
    CommonModule,
    MarkerRoutingModule
  ]
})
export class MarkerModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkerRoutingModule } from './marker-routing.module';
import { MarkerComponent } from './marker.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    MarkerComponent
  ],
  imports: [
    SharedModule,
    MarkerRoutingModule
  ]
})
export class MarkerModule { }

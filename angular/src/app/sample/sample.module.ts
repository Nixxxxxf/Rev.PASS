import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SampleRoutingModule } from './sample-routing.module';
import { SampleComponent } from './sample.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    SampleComponent
  ],
  imports: [
    SharedModule,
    SampleRoutingModule
  ]
})
export class SampleModule { }

import { NgModule } from '@angular/core';

import { GradientDilutionRoutingModule } from './gradient-dilution-routing.module';
import { GradientDilutionComponent } from './gradient-dilution.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    GradientDilutionComponent
  ],
  imports: [
    SharedModule,
    GradientDilutionRoutingModule
  ]
})
export class GradientDilutionModule { }

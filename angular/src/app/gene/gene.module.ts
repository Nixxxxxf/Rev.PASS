import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneRoutingModule } from './gene-routing.module';
import { GeneComponent } from './gene.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    GeneComponent
  ],
  imports: [
    SharedModule,
    GeneRoutingModule
  ]
})
export class GeneModule { }

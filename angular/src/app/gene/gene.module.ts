import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneRoutingModule } from './gene-routing.module';
import { GeneComponent } from './gene.component';


@NgModule({
  declarations: [
    GeneComponent
  ],
  imports: [
    CommonModule,
    GeneRoutingModule
  ]
})
export class GeneModule { }

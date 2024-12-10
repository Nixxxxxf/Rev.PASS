import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenePlateResultRoutingModule } from './gene-plate-result-routing.module';
import { GenePlateResultComponent } from './gene-plate-result.component';


@NgModule({
  declarations: [
    GenePlateResultComponent
  ],
  imports: [
    CommonModule,
    GenePlateResultRoutingModule
  ]
})
export class GenePlateResultModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneTypingAlgorithmRoutingModule } from './gene-typing-algorithm-routing.module';
import { GeneTypingAlgorithmComponent } from './gene-typing-algorithm.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    GeneTypingAlgorithmComponent
  ],
  imports: [
    SharedModule,
    GeneTypingAlgorithmRoutingModule
  ]
})
export class GeneTypingAlgorithmModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneTypingAlgorithmRoutingModule } from './gene-typing-algorithm-routing.module';
import { GeneTypingAlgorithmComponent } from './gene-typing-algorithm.component';


@NgModule({
  declarations: [
    GeneTypingAlgorithmComponent
  ],
  imports: [
    CommonModule,
    GeneTypingAlgorithmRoutingModule
  ]
})
export class GeneTypingAlgorithmModule { }

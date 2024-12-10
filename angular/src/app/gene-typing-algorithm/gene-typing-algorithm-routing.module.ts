import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneTypingAlgorithmComponent } from './gene-typing-algorithm.component';

const routes: Routes = [{ path: '', component: GeneTypingAlgorithmComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneTypingAlgorithmRoutingModule { }

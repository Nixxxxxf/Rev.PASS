import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CsvHeaderComponent } from './csv-header.component';

const routes: Routes = [{ path: '', component: CsvHeaderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CsvHeaderRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidCategoryComponent } from './liquid-category.component';

const routes: Routes = [{ path: '', component: LiquidCategoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidCategoryRoutingModule { }

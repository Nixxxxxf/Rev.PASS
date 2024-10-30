import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiquidCategoryRoutingModule } from './liquid-category-routing.module';
import { LiquidCategoryComponent } from './liquid-category.component';
import { SharedModule } from '../shared/shared.module';
//import { LiquidTypePipe } from './liquid-type.pipe';
//import { LiquidTypePipe } from '../shared/liquid-type.pipe';
//import { LiquidTypePipe } from '../shared/liquid-type.pipe';



@NgModule({
  declarations: [
    LiquidCategoryComponent,
    //LiquidTypePipe
  ],
  imports: [
    SharedModule,
    LiquidCategoryRoutingModule
  ]
})
export class LiquidCategoryModule { }

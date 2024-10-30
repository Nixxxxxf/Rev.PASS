import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiquidPositionInPlateRoutingModule } from './liquid-position-in-plate-routing.module';
import { LiquidPositionInPlateComponent } from './liquid-position-in-plate.component';
import { SharedModule } from '../shared/shared.module';
//import { LiquidTypePipe } from '../shared/liquid-type.pipe';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TabViewModule } from 'primeng/tabview';
import { LiquidTypePipe } from './liquid-type.pipe';


@NgModule({
  declarations: [
    LiquidPositionInPlateComponent,
    LiquidTypePipe
  ],
  imports: [
    SharedModule,
    LiquidPositionInPlateRoutingModule,
    ButtonModule,
    AutoCompleteModule,
    TabViewModule,
  ]
})
export class LiquidPositionInPlateModule { }

import { NgModule } from '@angular/core';
import { InstrumentRoutingModule } from './instrument-routing.module';
import { InstrumentComponent } from './instrument.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    InstrumentComponent
  ],
  imports: [
    SharedModule,
    InstrumentRoutingModule
  ]
})
export class InstrumentModule { }

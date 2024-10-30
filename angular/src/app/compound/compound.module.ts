import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompoundRoutingModule } from './compound-routing.module';
import { CompoundComponent } from './compound.component';
import { SharedModule } from '../shared/shared.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [
    CompoundComponent
  ],
  imports: [
    SharedModule,
    CompoundRoutingModule,
    AutoCompleteModule,
    ButtonModule,
  ]
})
export class CompoundModule { }

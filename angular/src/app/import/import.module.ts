import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportRoutingModule } from './import-routing.module';
import { ImportComponent } from './import.component';
import { SharedModule } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

@NgModule({
  declarations: [
    ImportComponent
  ],
  imports: [
    SharedModule,
    ImportRoutingModule,
    MessagesModule,
    
  ]
})
export class ImportModule { }

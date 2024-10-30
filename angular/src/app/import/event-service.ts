import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
  
export class EventService {
  myEvent1: EventEmitter<string> = new EventEmitter<string>();
  myEvent1_1: EventEmitter<string> = new EventEmitter<string>();
  myEvent2: EventEmitter<string> = new EventEmitter<string>();
  myEvent3: EventEmitter<string> = new EventEmitter<string>();
  myEvent4: EventEmitter<string> = new EventEmitter<string>();
  myEvent5: EventEmitter<string> = new EventEmitter<string>();
  myEvent6: EventEmitter<string> = new EventEmitter<string>();
  myEvent7: EventEmitter<string> = new EventEmitter<string>();
  myEvent8: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }
}

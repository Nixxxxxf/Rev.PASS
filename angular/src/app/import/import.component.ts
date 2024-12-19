import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import { Parser } from './parser';
import { OpCompoundLibraryService } from '@proxy/open-app-service';
import { Message } from 'primeng/api';
import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EventService } from './event-service';
import { CsvHeaderService } from '@proxy/app-services';
import { ListService } from '@abp/ng.core';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  providers: [ListService],
})
@Injectable({
  providedIn: 'root'
})


export class ImportComponent implements OnInit{

  myEvent: EventEmitter<any> = new EventEmitter<any>();
  private parser: Parser;
  private data: any[];
  messages: Message[] = [];
  messages_1: Message[] = [];
  messages_1_1: Message[] = [];
  messages_2: Message[] = [];
  messages_3: Message[] = [];
  messages_4: Message[] = [];
  messages_5: Message[] = [];
  messages_6: Message[] = [];
  messages_7: Message[] = [];
  messages_8: Message[] = [];
  messages_9: Message[] = [];
  messages_10: Message[] = [];
  messages_11: Message[] = [];
  messages_12: Message[] = [];
  messages_13: Message[] = [];
  messages_14: Message[] = [];
  messages_15: Message[] = [];

  private fileContent: any;
  private fileContent_1: any;
  private fileContent_1_1: any;
  private fileContent_2: any;
  private fileContent_3: any;
  private fileContent_4: any;
  private fileContent_5: any;
  private fileContent_6: any;
  private fileContent_7: any;
  private fileContent_8: any;
  private fileContent_9: any;
  private fileContent_10: any;
  private fileContent_11: any;
  private fileContent_12: any;
  private fileContent_13: any;
  private fileContent_14: any;
  private fileContent_15: any;

  private fileType: string = "";
  private fileType_1: string = "";
  private fileType_1_1: string = "";
  private fileType_2: string = "";
  private fileType_3: string = "";
  private fileType_4: string = "";
  private fileType_5: string = "";
  private fileType_6: string = "";
  private fileType_7: string = "";
  private fileType_8: string = "";
  private fileType_9: string = "";
  private fileType_10: string = "";
  private fileType_11: string = "";
  private fileType_12: string = "";
  private fileType_13: string = "";
  private fileType_14: string = "";
  private fileType_15: string = "";

  private fileName_7: string = "";
  private fileName_8: string = "";

  plateName_8: string = "";
  instrument_8: string = "...";

  

  constructor(
    private opCompoundLibraryService: OpCompoundLibraryService,
    private csvHeaderService: CsvHeaderService,
    private eventService: EventService
    ) {

    this.parser = new Parser(opCompoundLibraryService, csvHeaderService, eventService);

  }


  ngOnInit(){
    this.subscribeEvents();

  }


  // 1. Compound library


  onFileSelected_1(event) {
    this.fileContent_1 = null;
    if (event.target.files.length == 0){
      return;
    };
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        this.fileType_1 = "Excel";
      }else if(file.name.endsWith('.csv') ){
        this.fileType_1 = "Csv";
      }else {
        this.messages_1 = [this.throwFileTypeError()];
        return;
      }
      this.fileContent_1 = e.target.result;
    };
    reader.readAsBinaryString(file);    
  }

  uploadFile_1() {
    this.parser.handle_Compound_Library_SmartTM(this.fileContent_1, this.fileType_1);
  }

  onComplete_1(data:string){
    let msgForamt = this.handleRespond(data)
    this.messages_1 =  [{ severity: msgForamt.severity, summary: msgForamt.summary, detail: msgForamt.detail }];
  }


  // 1_1. Compound Plate

  onFileSelected_1_1(event) {
    this.fileContent_1_1 = null;
    if (event.target.files.length == 0){
      return;
    };
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        this.fileType_1_1 = "Excel";
      }else if(file.name.endsWith('.csv') ){
        this.fileType_1_1 = "Csv";
      }else {
        this.messages_1_1 = [this.throwFileTypeError()];
        return;
      }
      this.fileContent_1_1 = e.target.result;
    };
    reader.readAsBinaryString(file);    
  }

  uploadFile_1_1() {
    this.parser.handle_Compound_Plate(this.fileContent_1_1, this.fileType_1_1);
  }

  onComplete_1_1(data:string){
    let msgForamt = this.handleRespond(data)
    this.messages_1_1 =  [{ severity: msgForamt.severity, summary: msgForamt.summary, detail: msgForamt.detail }];
  }


  // 2. Cell Plate

  onFileSelected_2(event) {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        this.fileType_2 = "Excel";
      }else if(file.name.endsWith('.csv') ){
        this.fileType_2 = "Csv";
      }else {
        this.messages_2 = [this.throwFileTypeError()];
        return;
      }
      this.fileContent_2 = e.target.result;
    };
    reader.readAsBinaryString(file);    
  }

  uploadFile_2() {
    this.parser.handle_Cell_Plate(this.fileContent_2, this.fileType_2);
  }

  onComplete_2(data:string){
    let msgForamt = this.handleRespond(data)
    this.messages_2 =  [{ severity: msgForamt.severity, summary: msgForamt.summary, detail: msgForamt.detail }];
  }


  // 3. DMSO Plate

  onFileSelected_3(event) {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        this.fileType_3 = "Excel";
      }else if(file.name.endsWith('.csv') ){
        this.fileType_3 = "Csv";
      }else {
        this.messages_3 = [this.throwFileTypeError()];
        return;
      }
      this.fileContent_3 = e.target.result;
    };
    reader.readAsBinaryString(file);    
  }

  uploadFile_3() {
    this.parser.handle_DMSO_Plate(this.fileContent_3, this.fileType_3);
  }

  onComplete_3(data:string){
    let msgForamt = this.handleRespond(data)
    this.messages_3 =  [{ severity: msgForamt.severity, summary: msgForamt.summary, detail: msgForamt.detail }];
  }


  // 4. Plate Copy

  onFileSelected_4(event) {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        this.fileType_4 = "Excel";
      }else if(file.name.endsWith('.csv') ){
        this.fileType_4 = "Csv";
      }else {
        this.messages_4 = [this.throwFileTypeError()];
        return;
      }
      this.fileContent_4 = e.target.result;
    };
    reader.readAsBinaryString(file);    
  }

  uploadFile_4() {
    this.parser.handle_Plate_Copy(this.fileContent_4, this.fileType_4);
  }

  onComplete_4(data:string){
    let msgForamt = this.handleRespond(data)
    this.messages_4 =  [{ severity: msgForamt.severity, summary: msgForamt.summary, detail: msgForamt.detail }];
  }


  // 5. Cherry pick

  onFileSelected_5(event) {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        this.fileType_5 = "Excel";
      }else if(file.name.endsWith('.csv') ){
        this.fileType_5 = "Csv";
      }else {
        this.messages_5 = [this.throwFileTypeError()];
        return;
      }
      this.fileContent_5 = e.target.result;
    };
    reader.readAsBinaryString(file);    
  }

  uploadFile_5() {
    this.parser.handle_Cherry_Pick(this.fileContent_5, this.fileType_5);
  }

  onComplete_5(data:string){
    let msgForamt = this.handleRespond(data)
    this.messages_5 =  [{ severity: msgForamt.severity, summary: msgForamt.summary, detail: msgForamt.detail }];
  }


// 6. Envision Result update

onFileSelected_6(event) {
  const file: File = event.target.files[0];
  const reader: FileReader = new FileReader();
  reader.onload = (e: any) => {
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      this.fileType_6 = "Excel";
    }else if(file.name.endsWith('.csv') ){
      this.fileType_6 = "Csv";
    }else {
      this.messages_6 = [this.throwFileTypeError()];
      return;
    }
    this.fileContent_6 = e.target.result;
  };
  reader.readAsBinaryString(file);    
}

uploadFile_6() {
  this.parser.handle_Envision_Result(this.fileContent_6, this.fileType_6);
}

onComplete_6(data:string){
  let msgForamt = this.handleRespond(data)
  this.messages_6 =  [{ severity: msgForamt.severity, summary: msgForamt.summary, detail: msgForamt.detail }];
}


 
// 7. Echo report

onFileSelected_7(event) {
  const file: File = event.target.files[0];
  const reader: FileReader = new FileReader();
  reader.onload = (e: any) => {
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      this.fileType_7 = "Excel";
    }else if(file.name.endsWith('.csv') ){
      this.fileType_7 = "Csv";
    }else {
      this.messages_7 = [this.throwFileTypeError()];
      return;
    }
    this.fileContent_7 = e.target.result;
    this.fileName_7 = file.name;
  };
  reader.readAsBinaryString(file);    
}

uploadFile_7() {
  this.parser.handle_Echo_Report(this.fileName_7, this.fileContent_7, this.fileType_7);
}

onComplete_7(data:string){
  let msgForamt = this.handleRespond(data)
  this.messages_7 =  [{ severity: msgForamt.severity, summary: msgForamt.summary, detail: msgForamt.detail }];
}


// 8. Gene marker result

onFileSelected_8(event) {
  const file: File = event.target.files[0];
  const reader: FileReader = new FileReader();
  reader.onload = (e: any) => {
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      this.fileType_8 = "Excel";
    }else if(file.name.endsWith('.csv') ){
      this.fileType_8 = "Csv";
    }else {
      this.messages_8 = [this.throwFileTypeError()];
      return;
    }
    this.fileContent_8 = e.target.result;
    this.fileName_8 = file.name;
  };
  reader.readAsBinaryString(file);    
}

uploadFile_8() {
  this.parser.handle_Gene_Marker_Result(this.fileName_8, this.fileContent_8, this.fileType_8, this.plateName_8, this.instrument_8);
}

onComplete_8(data:string){
  let msgForamt = this.handleRespond(data)
  this.messages_8 =  [{ severity: msgForamt.severity, summary: msgForamt.summary, detail: msgForamt.detail }];
}



// 9. Gene plate

onFileSelected_9(event) {
  const file: File = event.target.files[0];
  const reader: FileReader = new FileReader();
  reader.onload = (e: any) => {
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      this.fileType_9 = "Excel";
    }else if(file.name.endsWith('.csv') ){
      this.fileType_9 = "Csv";
    }else {
      this.messages_9 = [this.throwFileTypeError()];
      return;
    }
    this.fileContent_9 = e.target.result;
  };
  reader.readAsBinaryString(file);    
}

uploadFile_9() {
  this.parser.handle_Gene_Plate(this.fileContent_9, this.fileType_9);
}

onComplete_9(data:string){
  let msgForamt = this.handleRespond(data)
  this.messages_9 =  [{ severity: msgForamt.severity, summary: msgForamt.summary, detail: msgForamt.detail }];
}


// 10. Marker plate

onFileSelected_10(event) {
  const file: File = event.target.files[0];
  const reader: FileReader = new FileReader();
  reader.onload = (e: any) => {
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      this.fileType_10 = "Excel";
    }else if(file.name.endsWith('.csv') ){
      this.fileType_10 = "Csv";
    }else {
      this.messages_10 = [this.throwFileTypeError()];
      return;
    }
    this.fileContent_10 = e.target.result;
  };
  reader.readAsBinaryString(file);    
}

uploadFile_10() {
  this.parser.handle_Marker_Plate(this.fileContent_10, this.fileType_10);
}

onComplete_10(data:string){
  let msgForamt = this.handleRespond(data)
  this.messages_10 =  [{ severity: msgForamt.severity, summary: msgForamt.summary, detail: msgForamt.detail }];
}


// 11. Gene Marker Mix

onFileSelected_11(event) {
  const file: File = event.target.files[0];
  const reader: FileReader = new FileReader();
  reader.onload = (e: any) => {
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      this.fileType_11 = "Excel";
    }else if(file.name.endsWith('.csv') ){
      this.fileType_11 = "Csv";
    }else {
      this.messages_11 = [this.throwFileTypeError()];
      return;
    }
    this.fileContent_11 = e.target.result;
  };
  reader.readAsBinaryString(file);    
}

uploadFile_11() {
  this.parser.handle_Gene_Marker_Mix(this.fileContent_11, this.fileType_11);
}

onComplete_11(data:string){
  let msgForamt = this.handleRespond(data)
  this.messages_11 =  [{ severity: msgForamt.severity, summary: msgForamt.summary, detail: msgForamt.detail }];
}


// // 12. ROX

// onFileSelected_12(event) {
//   const file: File = event.target.files[0];
//   const reader: FileReader = new FileReader();
//   reader.onload = (e: any) => {
//     if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
//       this.fileType_12 = "Excel";
//     }else if(file.name.endsWith('.csv') ){
//       this.fileType_12 = "Csv";
//     }else {
//       this.messages_12 = [this.throwFileTypeError()];
//       return;
//     }
//     this.fileContent_12 = e.target.result;
//   };
//   reader.readAsBinaryString(file);    
// }

// uploadFile_12() {
//   this.parser.handle_Marker_Plate(this.fileContent_12, this.fileType_12);
// }

// onComplete_12(data:string){
//   let msgForamt = this.handleRespond(data)
//   this.messages_12 =  [{ severity: msgForamt.severity, summary: msgForamt.summary, detail: msgForamt.detail }];
// }


// // 13. HEX

// onFileSelected_13(event) {
//   const file: File = event.target.files[0];
//   const reader: FileReader = new FileReader();
//   reader.onload = (e: any) => {
//     if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
//       this.fileType_13 = "Excel";
//     }else if(file.name.endsWith('.csv') ){
//       this.fileType_13 = "Csv";
//     }else {
//       this.messages_13 = [this.throwFileTypeError()];
//       return;
//     }
//     this.fileContent_13 = e.target.result;
//   };
//   reader.readAsBinaryString(file);    
// }

// uploadFile_13() {
//   this.parser.handle_Marker_Plate(this.fileContent_13, this.fileType_13);
// }

// onComplete_13(data:string){
//   let msgForamt = this.handleRespond(data)
//   this.messages_13 =  [{ severity: msgForamt.severity, summary: msgForamt.summary, detail: msgForamt.detail }];
// }


// // 14. FAM

// onFileSelected_14(event) {
//   const file: File = event.target.files[0];
//   const reader: FileReader = new FileReader();
//   reader.onload = (e: any) => {
//     if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
//       this.fileType_14 = "Excel";
//     }else if(file.name.endsWith('.csv') ){
//       this.fileType_14 = "Csv";
//     }else {
//       this.messages_14 = [this.throwFileTypeError()];
//       return;
//     }
//     this.fileContent_14 = e.target.result;
//   };
//   reader.readAsBinaryString(file);    
// }

// uploadFile_14() {
//   this.parser.handle_Marker_Plate(this.fileContent_14, this.fileType_14);
// }

// onComplete_14(data:string){
//   let msgForamt = this.handleRespond(data)
//   this.messages_14 =  [{ severity: msgForamt.severity, summary: msgForamt.summary, detail: msgForamt.detail }];
// }






//////////////////////////////////////////////////////////////////////////
//    Utility
//////////////////////////////////////////////////////////////////////////
  
  subscribeEvents(){
    this.eventService.myEvent1.subscribe((data:string) => {
      console.log('My event 1 triggered!');
      this.onComplete_1(data);
    });

    this.eventService.myEvent1_1.subscribe((data:string) => {
      console.log('My event 1_1 triggered!');
      this.onComplete_1_1(data);
    });

    this.eventService.myEvent2.subscribe((data:string) => {
      console.log('My event 2 triggered!');
      this.onComplete_2(data);
    });

    this.eventService.myEvent3.subscribe((data:string) => {
      console.log('My event 3 triggered!');
      this.onComplete_3(data);
    });

    this.eventService.myEvent4.subscribe((data:string) => {
      console.log('My event 4 triggered!');
      this.onComplete_4(data);
    });

    this.eventService.myEvent5.subscribe((data:string) => {
      console.log('My event 5 triggered!');
      this.onComplete_5(data);
    });

    this.eventService.myEvent6.subscribe((data:string) => {
      console.log('My event 6 triggered!');
      this.onComplete_6(data);
    });

    this.eventService.myEvent7.subscribe((data:string) => {
      console.log('My event 7 triggered!');
      this.onComplete_7(data);
    });

    this.eventService.myEvent8.subscribe((data:string) => {
      console.log('My event 8 triggered!');
      this.onComplete_8(data);
    });

    this.eventService.myEvent9.subscribe((data:string) => {
      console.log('My event 9 triggered!');
      this.onComplete_9(data);
    });

    this.eventService.myEvent10.subscribe((data:string) => {
      console.log('My event 10 triggered!');
      this.onComplete_10(data);
    });

    this.eventService.myEvent11.subscribe((data:string) => {
      console.log('My event 11 triggered!');
      this.onComplete_11(data);
    });

    // this.eventService.myEvent12.subscribe((data:string) => {
    //   console.log('My event 12 triggered!');
    //   this.onComplete_12(data);
    // });

    // this.eventService.myEvent13.subscribe((data:string) => {
    //   console.log('My event 13 triggered!');
    //   this.onComplete_13(data);
    // });

    // this.eventService.myEvent14.subscribe((data:string) => {
    //   console.log('My event 14 triggered!');
    //   this.onComplete_14(data);
    // });

    // this.eventService.myEvent15.subscribe((data:string) => {
    //   console.log('My event 15 triggered!');
    //   this.onComplete_15(data);
    // });
  }



  handleRespond(data:string):Message{
    let jsonObject = JSON.parse(data);
    let msgFormat :Message = {};

    if (jsonObject.ErrorCode==0) {
      msgFormat.severity = "success";
      msgFormat.detail = jsonObject.ErrorMessage;
      msgFormat.summary = "Success";
    }else if (jsonObject.ErrorCode==1){
      msgFormat.severity = "warn";
      msgFormat.detail = jsonObject.ErrorMessage;
      msgFormat.summary = "Warn";
    }else{
      msgFormat.severity = "error";
      msgFormat.detail = jsonObject.ErrorMessage;
      msgFormat.summary = "Error";
    }
    return msgFormat;
  }


  throwFileTypeError():Message{
    let msg:Message={
      severity:"error",
      summary:"Error",
      detail:"File type should be 'xls','xlsx','csv'."
    }
    return msg; 
  }


}
function jQuery(arg0: string) {
  throw new Error('Function not implemented.');
}


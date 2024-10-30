import { ListService, PagedResultDto, QueryStreamCreatorCallback } from '@abp/ng.core';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonService, PlateTransferService } from '@proxy/app-services';
import { LiquidTransferService } from '@proxy/app-services/liquid-transfer.service';
import { PlateService } from '@proxy/app-services/plate.service';
import { PlateDto, LiquidTransferHistoryDto, PlateTransferHistoryDto, InstrumentDto } from '@proxy/dtos';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-plate-transfer-history',
  templateUrl: './plate-transfer-history.component.html',
  styleUrls: ['./plate-transfer-history.component.scss'],
  providers: [ListService, DatePipe],
})
export class PlateTransferHistoryComponent implements OnInit{
  plateTransferHistories = { items: [], totalCount: 0 } as PagedResultDto<PlateTransferHistoryDto>;

  constructor(
    public readonly list: ListService, 
    private plateTransferHistoryService: PlateTransferService,
    private commonService: CommonService, 
    private datePipe: DatePipe
    ) { }


  // Select plates box
  selectedPlate: any;
  filteredPlates: any[] | undefined;
  plates: any[] | undefined;

  selectedInstrument: any;
  filteredInstruments: any[] | undefined;
  Instruments: any[] | undefined;

  formattedData: PlateTransferHistoryDto[] = [];
  
  transferHistoryStreamCreator: QueryStreamCreatorCallback<PlateTransferHistoryDto, null>;

  plateName:string = "";
  instrumentName:string = "";


  ngOnInit() {
    this.plates = [];
    this.Instruments = [];
    this.getAllPlates();
    this.getAllInstruments();

    this.transferHistoryStreamCreator = (query) => this.plateTransferHistoryService.getListWithFilter(this.plateName,this.instrumentName,query);
    this.list.hookToQuery(this.transferHistoryStreamCreator).subscribe((response) => {
      this.plateTransferHistories = response;
      console.log(this.plateTransferHistories)
      // this.fmtDateTime();
    });
  }


  // Init plates
  getAllPlates(){
    this.commonService.getAllPlates().subscribe((data:PlateDto[])=>{
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        this.plates.push({ label: item.name, value: item });
      }
    })
  }

  // Init instruments
  getAllInstruments(){
    this.commonService.getAllInstruments().subscribe((data:InstrumentDto[])=>{
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        this.Instruments.push({ label: item.name, value: item });
      }
    })
  }


  // Auto complete
  filterPlates(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.plates as any[]).length; i++) {
      let item = (this.plates as any[])[i];
      if (item.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        filtered.push(item);
      }
    }
    this.filteredPlates = filtered;
  }

  filterInstruments(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.Instruments as any[]).length; i++) {
      let item = (this.Instruments as any[])[i];
      if (item.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        filtered.push(item);
      }
    }
    this.filteredInstruments = filtered;
  }


  
  searchWithFilter(event:Event){
    console.log("click");
    console.log(this.selectedPlate)
    console.log(this.selectedInstrument)
    if(this.selectedPlate==undefined){
      this.plateName = ""
    }else if(this.selectedPlate.value==undefined){
      this.plateName = this.selectedPlate;
    }else{
      this.plateName = this.selectedPlate.value.name;
    }

    if(this.selectedInstrument==undefined){
      this.instrumentName = ""
    }else if(this.selectedInstrument.value==undefined){
      this.instrumentName = this.selectedInstrument;
    }else{
      this.instrumentName = this.selectedInstrument.value.name;
    }
    console.log(this.plateName)
    console.log(this.instrumentName)
     // Table
     this.list.hookToQuery(this.transferHistoryStreamCreator).subscribe((response) => {
       this.plateTransferHistories = response;
     });
     

  }





  fmtDateTime(){
    this.formattedData = this.plateTransferHistories.items.map(item => {
      return {
        ...item,
        assayTime: this.datePipe.transform(item.assayTime, 'yyyy-MM-dd HH:mm:ss'),
        transferTime: this.datePipe.transform(item.transferTime, 'yyyy-MM-dd HH:mm:ss')
      };
    });

    this.plateTransferHistories.items = this.formattedData;
  }




}

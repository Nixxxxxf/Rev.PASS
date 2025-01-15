import { ListService, PagedResultDto, QueryStreamCreatorCallback } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '@proxy/app-services';
import { InstrumentService } from '@proxy/app-services/instrument.service';
import { PlateService } from '@proxy/app-services/plate.service';
import { InstrumentDto, PlateDto } from '@proxy/dtos';

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.component.html',
  styleUrls: ['./instrument.component.scss'],
  providers: [ListService],
})
export class InstrumentComponent implements OnInit{

  constructor(
    public readonly list: ListService,
    private instrumentService: InstrumentService,
    private commonService: CommonService,
    ) { }

    instrumentStreamCreator: QueryStreamCreatorCallback<InstrumentDto, null>;

  instrumentLst = { items: [], totalCount: 0 } as PagedResultDto<InstrumentDto>;

  selectedInstrument: any;
  filteredInstruments: any[] | undefined;
  instruments: any[] | undefined;
  instrumentName:string = "";

  ngOnInit() {
    const instrumentStreamCreator = (query) => this.instrumentService.getList(query);

    this.list.hookToQuery(instrumentStreamCreator).subscribe((response) => {
      this.instrumentLst = response;
    });

    this.instruments = [];
    this.getAllInstrument();

    this.instrumentStreamCreator = (query) => this.instrumentService.getListWithFilter(this.instrumentName,query);
    this.list.hookToQuery(this.instrumentStreamCreator).subscribe((response) => {
      this.instrumentLst = response;
      console.log(this.instrumentLst)
      // this.fmtDateTime();
    });
  }

  // Init instruments
  getAllInstrument(){
    this.commonService.getAllInstruments().subscribe((data:InstrumentDto[])=>{
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        this.instruments.push({ label: item.name, value: item });
      }
    })
  }

  searchWithFilter(event:Event){
    console.log("click");
    console.log(this.selectedInstrument)
    if(this.selectedInstrument==undefined){
      this.instrumentName = ""
    }else if(this.selectedInstrument.value==undefined){
      this.instrumentName = this.selectedInstrument;
    }else{
      this.instrumentName = this.selectedInstrument.value.name;
    }
    console.log(this.instrumentName)
     // Table
    this.list.hookToQuery(this.instrumentStreamCreator).subscribe((response) => {
      this.instrumentLst = response;
    });
    

  }
}

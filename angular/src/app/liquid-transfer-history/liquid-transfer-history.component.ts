import { ListService, PagedResultDto, QueryStreamCreatorCallback } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '@proxy/app-services';
import { LiquidTransferService } from '@proxy/app-services/liquid-transfer.service';
import { PlateService } from '@proxy/app-services/plate.service';
import { PlateDto, LiquidTransferHistoryDto } from '@proxy/dtos';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-liquid-transfer-history',
  templateUrl: './liquid-transfer-history.component.html',
  styleUrls: ['./liquid-transfer-history.component.scss'],
  providers: [ListService],
})
export class LiquidTransferHistoryComponent implements OnInit{
  liquidTransferHistories = { items: [], totalCount: 0 } as PagedResultDto<LiquidTransferHistoryDto>;

  constructor(
    public readonly list: ListService, 
    private liquidTransferHistoryService: LiquidTransferService,
    private commonService: CommonService, 
    ) { }


  // Select plates box
  selectedSrPlate: any;
  filteredSrPlates: any[] | undefined;
  srPlates: any[] | undefined;

  selectedDsPlate: any;
  filteredDsPlates: any[] | undefined;
  dsPlates: any[] | undefined;

  transferHistoryStreamCreator: QueryStreamCreatorCallback<LiquidTransferHistoryDto, null>;
  srPlateName:string="";
  dsPlateName:string="";

  ngOnInit() {
    this.srPlates = [];
    this.dsPlates = [];
    this.getAllPlates();

    this.transferHistoryStreamCreator = (query) => this.liquidTransferHistoryService.getListWithFilter(this.srPlateName,this.dsPlateName,"","","",query);
    this.list.hookToQuery(this.transferHistoryStreamCreator).subscribe((response) => {
      this.liquidTransferHistories = response;
      console.log(this.liquidTransferHistories)
    });
  }


  // Init plates
  getAllPlates(){
    this.commonService.getAllPlates().subscribe((data:PlateDto[])=>{
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        this.srPlates.push({ label: item.name, value: item });
        this.dsPlates.push({ label: item.name, value: item });
      }
    })
  }


   // Auto complete
   filterSrPlates(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.srPlates as any[]).length; i++) {
      let item = (this.srPlates as any[])[i];
      if (item.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        filtered.push(item);
      }
    }
    this.filteredSrPlates = filtered;
  }

  filterDsPlates(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.dsPlates as any[]).length; i++) {
      let item = (this.dsPlates as any[])[i];
      if (item.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        filtered.push(item);
      }
    }
    this.filteredDsPlates = filtered;
  }


  searchWithFilter(event:Event){

    if(this.selectedSrPlate==undefined){
      this.srPlateName = ""
    }else if(this.selectedSrPlate.value==undefined){
      this.srPlateName = this.selectedSrPlate;
    }else{
      this.srPlateName = this.selectedSrPlate.value.name;
    }

    if(this.selectedDsPlate==undefined){
      this.dsPlateName = ""
    }else if(this.selectedDsPlate.value==undefined){
      this.dsPlateName = this.selectedDsPlate;
    }else{
      this.dsPlateName = this.selectedDsPlate.value.name;
    }

     // Table
     this.list.hookToQuery(this.transferHistoryStreamCreator).subscribe((response) => {
       this.liquidTransferHistories = response;
     });
     

  }






}
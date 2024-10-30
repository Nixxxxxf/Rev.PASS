import { ListService, PagedResultDto, QueryStreamCreatorCallback } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { CommonService, CsvHeaderService } from '@proxy/app-services';
import { CsvHeaderDto, InstrumentDto } from '@proxy/dtos';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-csv-header',
  templateUrl: './csv-header.component.html',
  styleUrls: ['./csv-header.component.scss'],
  providers: [ListService],
})
export class CsvHeaderComponent  implements OnInit{
  csvHeaders = { items: [], totalCount: 0 } as PagedResultDto<CsvHeaderDto>;

  constructor(public readonly list: ListService, 
    private csvHeaderService: CsvHeaderService,
    private commonService: CommonService,
    ) { }

  // Select csv name box
  selectedCsv: any;
  filteredCsvs: any[] | undefined;
  csvs: any[] | undefined;

  csvHeaderFilterStreamCreator: QueryStreamCreatorCallback<CsvHeaderDto, null>;
  csvName:string = "";


  ngOnInit() {
    this.csvs = [];
    this.getAllCsvs();


    this.csvHeaderFilterStreamCreator = (query) => this.csvHeaderService.getListWithFilter(this.csvName, query);
    this.list.hookToQuery(this.csvHeaderFilterStreamCreator).subscribe((response) => {
      this.csvHeaders = response;
      console.log(this.csvHeaders)
    });
  }

  // Init Csvs
  getAllCsvs(){
    this.csvHeaderService.getAllCsvFileName().subscribe((data:string[])=>{
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        this.csvs.push({ label: item, value: item });
      }
    })
  }


  // Auto complete
  filterCsvs(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.csvs as any[]).length; i++) {
      let item = (this.csvs as any[])[i];
      if (item.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        filtered.push(item);
      }
    }
    this.filteredCsvs = filtered;
  }


  searchWithFilter(event:Event){
    this.csvName = "";
    if (this.selectedCsv == undefined) {
      this.csvName = "";
    }
    else {
      this.csvName = this.selectedCsv
    }

    console.log(this.csvName)
     // Table
     this.list.hookToQuery(this.csvHeaderFilterStreamCreator).subscribe((response) => {
       this.csvHeaders = response;
       console.log()
     });
     

  }




}

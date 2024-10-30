import { ListService, PagedResultDto, QueryStreamCreatorCallback } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { ReportService } from '@proxy/app-services';
import { LiquidPositionInPlateDto, ReportDto, ReportItemDto } from '@proxy/dtos';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-echo-report',
  templateUrl: './echo-report.component.html',
  styleUrls: ['./echo-report.component.scss'],
  providers: [ListService],

})
export class EchoReportComponent implements OnInit {

  constructor(public readonly list: ListService, private reportService: ReportService,
  ) { }
  
  reportItems = { items: [], totalCount: 0 } as PagedResultDto<ReportItemDto>;

  // Select reports box
  selectedReport: any;
  filteredReports: any[] | undefined;
  reports: any[] | undefined;

  reportItemStreamCreator: QueryStreamCreatorCallback<ReportItemDto, null>;

  reportName:string = "";
  reportType:string = "Echo"

  ngOnInit() {
    this.reports = [];
    this.getAllReports();
    
    this.reportItemStreamCreator = (query) => this.reportService.getReportList(this.reportType, this.reportName, query);
    this.list.hookToQuery(this.reportItemStreamCreator).subscribe((response) => {
      this.reportItems = response;
      console.log(this.reportItems)
    });
  }

  // Init reports
  getAllReports() {
    this.reportService.getAllReports(this.reportType).subscribe((data: ReportDto[]) => {
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        this.reports.push({ label: item.reportName, value: item });
      }
    })
  }


  // Auto complete
  filterReports(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.reports as any[]).length; i++) {
      let item = (this.reports as any[])[i];
      if (item.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        filtered.push(item);
      }
    }
    this.filteredReports = filtered;
  }



  // Click search button, init charts
  searchWithFilters(event: Event) {

    console.log("click");
    console.log(this.selectedReport);
    
    this.reportName = "";
    if (this.selectedReport == undefined) {
      this.reportName = "";
    }
    else {
      this.reportName = this.selectedReport;
    }
    console.log(this.reportName)
    // Table
    this.list.hookToQuery(this.reportItemStreamCreator).subscribe((response) => {
      this.reportItems = response;
      console.log(this.reportItems)
    });

  }
}

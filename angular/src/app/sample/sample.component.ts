import { ListService, PagedResultDto, QueryStreamCreatorCallback } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { CommonService, LiquidCategoryService } from '@proxy/app-services';
import { LiquidService } from '@proxy/app-services/liquid.service';
import { PlateService } from '@proxy/app-services/plate.service';
import { LiquidCategoryDto, LiquidDto, PlateDto } from '@proxy/dtos';
//import { LiquidTypePipe } from '../liquid-position-in-plate/liquid-type.pipe';


@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrl: './sample.component.scss',
  providers: [ListService],
})

export class SampleComponent implements OnInit{

  constructor(
    public readonly list: ListService, 
    private liquidCategoryService: LiquidCategoryService,
    private commonService: CommonService,) { }


  samples = { items: [], totalCount: 0 } as PagedResultDto<LiquidCategoryDto>;

  // Select plates box
  selectedName: any;
  filteredNames: any[] | undefined;
  names: any[] | undefined;

  // Filter input
  filter: string = "";
  sampleName:string = "";

  sampleStreamCreator: QueryStreamCreatorCallback<LiquidCategoryDto, null>;

  ngOnInit() {
    this.names = [];
    this.getAllSampleNames();

    this.sampleStreamCreator = (query) => this.liquidCategoryService.getSampleList(this.sampleName,this.filter, query);
    this.list.hookToQuery(this.sampleStreamCreator).subscribe((response) => {
      this.samples = response;
      console.log(this.samples)
    });
  }

  // Init SampleNames
  getAllSampleNames() {
    this.commonService.getAllSamples().subscribe((data: string[]) => {
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        this.names.push({ label: item, value: item });
      }
    })
  }


  // Click search button, init charts
  searchWithFilters(event: Event) {
    //console.log(this.selectedSmiles)
    console.log("click");
    this.sampleName = "";
    if (this.selectedName == undefined) {
      this.sampleName = "";
    }else if (this.selectedName.value == undefined) {
      this.sampleName = this.selectedName;
    }else {
      this.sampleName = this.selectedName.value
    }

    console.log(this.sampleName)
    // Table
    this.list.hookToQuery(this.sampleStreamCreator).subscribe((response) => {
      this.samples = response;
      console.log(this.samples)
    });

  }
}

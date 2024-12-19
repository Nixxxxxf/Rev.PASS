import { ListService, PagedResultDto, QueryStreamCreatorCallback } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { CommonService, LiquidCategoryService } from '@proxy/app-services';
import { LiquidService } from '@proxy/app-services/liquid.service';
import { PlateService } from '@proxy/app-services/plate.service';
import { LiquidCategoryDto, LiquidDto, PlateDto } from '@proxy/dtos';
//import { LiquidTypePipe } from '../liquid-position-in-plate/liquid-type.pipe';


@Component({
  selector: 'app-marker',
  templateUrl: './marker.component.html',
  styleUrl: './marker.component.scss',
  providers: [ListService],
})
export class MarkerComponent implements OnInit{

  constructor(
    public readonly list: ListService, 
    private liquidCategoryService: LiquidCategoryService,
    private commonService: CommonService,) { }


  markers = { items: [], totalCount: 0 } as PagedResultDto<LiquidCategoryDto>;

  // Select plates box
  selectedName: any;
  filteredNames: any[] | undefined;
  names: any[] | undefined;

  // Filter input
  filter: string = "";
  markerName:string = "";

  markerStreamCreator: QueryStreamCreatorCallback<LiquidCategoryDto, null>;

  ngOnInit() {
    this.names = [];
    this.getAllMarkerNames();

    this.markerStreamCreator = (query) => this.liquidCategoryService.getMarkerList(this.markerName,this.filter, query);
    this.list.hookToQuery(this.markerStreamCreator).subscribe((response) => {
      this.markers = response;
      console.log(this.markers)
    });
  }

  // Init MarkerNames
  getAllMarkerNames() {
    this.commonService.getAllMarkers().subscribe((data: string[]) => {
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
    this.markerName = "";
    if (this.selectedName == undefined) {
      this.markerName = "";
    }else if (this.selectedName.value == undefined) {
      this.markerName = this.selectedName;
    }else {
      this.markerName = this.selectedName.value
    }

    console.log(this.markerName)
    // Table
    this.list.hookToQuery(this.markerStreamCreator).subscribe((response) => {
      this.markers = response;
      console.log(this.markers)
    });

  }
}

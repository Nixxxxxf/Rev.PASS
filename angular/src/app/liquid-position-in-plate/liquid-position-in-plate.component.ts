import { ListService, PagedResultDto, QueryStreamCreatorCallback } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { LiquidService } from '@proxy/app-services/liquid.service';
import { PlateService } from '@proxy/app-services/plate.service';
import { LiquidCategoryDto, LiquidDto, LiquidPositionInPlateDto, PlateDto } from '@proxy/dtos';
//import { LiquidTypePipe } from '../shared/liquid-type.pipe';
import { CommonService } from '@proxy/app-services';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { LiquidTypePipe } from './liquid-type.pipe';


@Component({
  selector: 'app-liquid-position-in-plate',
  templateUrl: './liquid-position-in-plate.component.html',
  styleUrls: ['./liquid-position-in-plate.component.scss'],
  providers: [ListService, LiquidTypePipe],
})
export class LiquidPositionInPlateComponent implements OnInit {

  constructor(public readonly list: ListService, private liquidService: LiquidService,
    private commonService: CommonService,
  ) { }
  
  liquids = { items: [], totalCount: 0 } as PagedResultDto<LiquidPositionInPlateDto>;

  // Select plates box
  selectedPlate: any;
  filteredPlates: any[] | undefined;
  plates: any[] | undefined;

  // Select liquidCategories box
  selectedLiquidCategory: any;
  filteredLiquidCategories: any[] | undefined;
  liquidCategories: any[] | undefined;
  liquidStreamCreator: QueryStreamCreatorCallback<LiquidPositionInPlateDto, null>;

  plateName:string = "";
  liquidCate:string = "";



  ngOnInit() {
    this.plates = [];
    this.liquidCategories = [];
    this.getAllPlates();
    this.getAllLiquidCategories();

    this.liquidStreamCreator = (query) => this.liquidService.getLiquidPositionInPlate(this.plateName,this.liquidCate, query);

    this.list.hookToQuery(this.liquidStreamCreator).subscribe((response) => {
      this.liquids = response;
      console.log(this.liquids)
    });
  }

  // Init plates
  getAllPlates() {
    this.commonService.getAllPlates().subscribe((data: PlateDto[]) => {
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        this.plates.push({ label: item.name, value: item });
      }
    })
  }

  // Init LiquidCategories
  getAllLiquidCategories() {
    this.commonService.getAllLiquidCategories().subscribe((data: LiquidCategoryDto[]) => {
      for (let i = 0; i < data.length; i++) {
        let item = data[i];

        let existingItem = this.liquidCategories.find(category => 
        category.label === item.name);

        if (!existingItem) {
          this.liquidCategories.push({ label: item.name, value: item });
        }
        //this.liquidCategories.push({ label: item.name, value: item });
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

  filterLiquidCategories(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.liquidCategories as any[]).length; i++) {
      let item = (this.liquidCategories as any[])[i];
      if (item.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        filtered.push(item);
      }
    }
    this.filteredLiquidCategories = filtered;
  }



  // Click search button, init charts
  searchWithFilters(event: Event) {

    console.log("click");
    this.plateName = "";
    if (this.selectedPlate == undefined) {
      this.plateName = "";
    }
    else if (this.selectedPlate.value == undefined) {
      this.plateName = this.selectedPlate;
    } else {
      this.plateName = this.selectedPlate.value.name;
    }

    this.liquidCate = "";
    if (this.selectedLiquidCategory == undefined) {
      this.liquidCate = "";
    }
    else if (this.selectedLiquidCategory.value == undefined) {
      this.liquidCate = this.selectedLiquidCategory;
    } else {
      this.liquidCate = this.selectedLiquidCategory.value.name;
    }

    // Table
    this.list.hookToQuery(this.liquidStreamCreator).subscribe((response) => {
      this.liquids = response;
      console.log(this.liquids)

    });

  }
}

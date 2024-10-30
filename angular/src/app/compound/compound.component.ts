import { ListService, PagedResultDto, QueryStreamCreatorCallback } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { CommonService, LiquidCategoryService } from '@proxy/app-services';
import { LiquidService } from '@proxy/app-services/liquid.service';
import { PlateService } from '@proxy/app-services/plate.service';
import { LiquidCategoryDto, LiquidDto, PlateDto } from '@proxy/dtos';
//import { LiquidTypePipe } from '../liquid-position-in-plate/liquid-type.pipe';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';



@Component({
  selector: 'app-compound',
  templateUrl: './compound.component.html',
  styleUrls: ['./compound.component.scss'],
  providers: [ListService],
})
export class CompoundComponent implements OnInit{

  constructor(
    public readonly list: ListService, 
    private liquidCategoryService: LiquidCategoryService,
    private commonService: CommonService,) { }


  compounds = { items: [], totalCount: 0 } as PagedResultDto<LiquidCategoryDto>;

  // Select plates box
  selectedName: any;
  filteredNames: any[] | undefined;
  names: any[] | undefined;

  // Select liquidCategories box
  selectedSmiles: any;
  filteredSmileses: any[] | undefined;
  smileses: any[] | undefined;

  compoundStreamCreator: QueryStreamCreatorCallback<LiquidCategoryDto, null>;

  compoundName:string = "";
  compoundSmiles:string = "";


  ngOnInit() {
    this.names = [];
    this.smileses = [];
    this.getAllCompoundNames();
    this.getAllCompoundSmileses();

    this.compoundStreamCreator = (query) => this.liquidCategoryService.getCompoundList(this.compoundName,this.compoundSmiles, query);
    this.list.hookToQuery(this.compoundStreamCreator).subscribe((response) => {
      this.compounds = response;
      console.log(this.compounds)
    });
  }

  // Init CompoundNames
  getAllCompoundNames() {
    this.commonService.getAllCompounds().subscribe((data: string[]) => {
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        this.names.push({ label: item, value: item });
      }
    })
  }

  // Init CompoundSMILES
  getAllCompoundSmileses() {
    this.commonService.getAllSMILES().subscribe((data: string[]) => {
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        this.smileses.push({ label: item, value: item });
      }
    })
  }


  // Auto complete
  filterNames(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.names as any[]).length; i++) {
      let item = (this.names as any[])[i];
      if (item.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        filtered.push(item);
      }
    }
    this.filteredNames = filtered;
  }

  filterSmileses(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.smileses as any[]).length; i++) {
      let item = (this.smileses as any[])[i];
      if (item.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        filtered.push(item);
      }
    }
    this.filteredSmileses = filtered;
  }



  // Click search button, init charts
  searchWithFilters(event: Event) {
    //console.log(this.selectedSmiles)
    console.log("click");
    this.compoundName = "";
    if (this.selectedName == undefined) {
      this.compoundName = "";
    }else if (this.selectedName.value == undefined) {
      this.compoundName = this.selectedName;
    }else {
      this.compoundName = this.selectedName.value
    }

    this.compoundSmiles = "";
    if (this.selectedSmiles == undefined) {
      this.compoundSmiles = "";
    }else if (this.selectedSmiles.value == undefined) {
      this.compoundSmiles = this.selectedSmiles;
    }else {
      this.compoundSmiles = this.selectedSmiles.value;
    }

    console.log(this.compoundName)
    console.log(this.compoundSmiles)
    // Table
    this.list.hookToQuery(this.compoundStreamCreator).subscribe((response) => {
      this.compounds = response;
      console.log(this.compounds)
    });

  }
}

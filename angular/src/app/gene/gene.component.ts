import { ListService, PagedResultDto, QueryStreamCreatorCallback } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { CommonService, LiquidCategoryService } from '@proxy/app-services';
import { LiquidService } from '@proxy/app-services/liquid.service';
import { PlateService } from '@proxy/app-services/plate.service';
import { LiquidCategoryDto, LiquidDto, PlateDto } from '@proxy/dtos';
//import { LiquidTypePipe } from '../liquid-position-in-plate/liquid-type.pipe';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';


@Component({
  selector: 'app-gene',
  templateUrl: './gene.component.html',
  styleUrl: './gene.component.scss',
  providers: [ListService],
})

export class GeneComponent implements OnInit{

  constructor(
    public readonly list: ListService, 
    private liquidCategoryService: LiquidCategoryService,
    private commonService: CommonService,) { }


  genes = { items: [], totalCount: 0 } as PagedResultDto<LiquidCategoryDto>;

  // Select plates box
  selectedName: any;
  filteredNames: any[] | undefined;
  names: any[] | undefined;

  // Filter input
  filter: string = "";
  geneName:string = "";

  geneStreamCreator: QueryStreamCreatorCallback<LiquidCategoryDto, null>;

  ngOnInit() {
    this.names = [];
    this.getAllGeneNames();

    this.geneStreamCreator = (query) => this.liquidCategoryService.getGeneList(this.geneName,this.filter, query);
    this.list.hookToQuery(this.geneStreamCreator).subscribe((response) => {
      this.genes = response;
      console.log(this.genes)
    });
  }

  // Init GeneNames
  getAllGeneNames() {
    this.commonService.getAllGenes().subscribe((data: string[]) => {
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
    this.geneName = "";
    if (this.selectedName == undefined) {
      this.geneName = "";
    }else if (this.selectedName.value == undefined) {
      this.geneName = this.selectedName;
    }else {
      this.geneName = this.selectedName.value
    }

    console.log(this.geneName)
    // Table
    this.list.hookToQuery(this.geneStreamCreator).subscribe((response) => {
      this.genes = response;
      console.log(this.genes)
    });

  }
}

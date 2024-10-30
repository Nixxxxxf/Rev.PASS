import { ListService, PagedResultDto,QueryStreamCreatorCallback } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '@proxy/app-services';
import { InstrumentService } from '@proxy/app-services/instrument.service';
import { PlateService } from '@proxy/app-services/plate.service';
import { InstrumentDto, PlateDto } from '@proxy/dtos';

@Component({
  selector: 'app-plate',
  templateUrl: './plate.component.html',
  styleUrls: ['./plate.component.scss'],
  providers: [ListService],
})
export class PlateComponent implements OnInit {
  plateLst = { items: [], totalCount: 0 } as PagedResultDto<PlateDto>;

  constructor(public readonly list: ListService, private plateService: PlateService,
    private commonService:CommonService) { }

  // Select plates box
  selectedPlate: any;
  filteredPlates: any[] | undefined;
  plates: any[] | undefined;
  plateName:string = "";

  plateStreamCreator: QueryStreamCreatorCallback<PlateDto, null>;


  ngOnInit() {

    this.plates = [];
    this.getAllPlates();

    // const plateStreamCreator = (query) => this.plateService.getList(query);

    // this.list.hookToQuery(plateStreamCreator).subscribe((response) => {
    //   this.plateLst = response;
    //   console.log(this.plateLst);
    // });

    this.plateStreamCreator = (query) => this.plateService.getListWithFilter(this.plateName, query);

    this.list.hookToQuery(this.plateStreamCreator).subscribe((response) => {
      this.plateLst = response;
      console.log(this.plateLst)
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

    // Table
    this.list.hookToQuery(this.plateStreamCreator).subscribe((response) => {
      this.plateLst = response;
      console.log(this.plateLst);
    });

  }
}

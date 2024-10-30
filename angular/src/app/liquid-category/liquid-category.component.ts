import { ListService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { LiquidCategoryService } from '@proxy/app-services';
import { LiquidService } from '@proxy/app-services/liquid.service';
import { PlateService } from '@proxy/app-services/plate.service';
import { LiquidCategoryDto, LiquidDto, PlateDto } from '@proxy/dtos';
//import { LiquidTypePipe } from '../liquid-position-in-plate/liquid-type.pipe';
//import { LiquidTypePipe } from '../shared/liquid-type.pipe';


@Component({
  selector: 'app-liquid-category',
  templateUrl: './liquid-category.component.html',
  styleUrls: ['./liquid-category.component.scss'],
  providers: [ListService],//, LiquidTypePipe
})

export class LiquidCategoryComponent implements OnInit{
  liquidCategories = { items: [], totalCount: 0 } as PagedResultDto<LiquidCategoryDto>;

  constructor(public readonly list: ListService, private liquidCategoryService: LiquidCategoryService) { }

  ngOnInit() {
    const liquidCategoryStreamCreator = (query) => this.liquidCategoryService.getList(query);

    this.list.hookToQuery(liquidCategoryStreamCreator).subscribe((response) => {
      this.liquidCategories = response;
      console.log(this.liquidCategories)
    });
  }
}
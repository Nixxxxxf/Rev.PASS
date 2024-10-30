import { ListService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { LiquidService } from '@proxy/app-services/liquid.service';
import { PlateService } from '@proxy/app-services/plate.service';
import { LiquidDto, PlateDto } from '@proxy/dtos';

@Component({
  selector: 'app-liquid',
  templateUrl: './liquid.component.html',
  styleUrls: ['./liquid.component.scss'],
  providers: [ListService],
})

export class LiquidComponent implements OnInit{
  liquids = { items: [], totalCount: 0 } as PagedResultDto<LiquidDto>;

  constructor(public readonly list: ListService, private liquidService: LiquidService) { }

  ngOnInit() {
    const liquidStreamCreator = (query) => this.liquidService.getList(query);

    this.list.hookToQuery(liquidStreamCreator).subscribe((response) => {
      this.liquids = response;
      console.log(this.liquids)
    });
  }
}
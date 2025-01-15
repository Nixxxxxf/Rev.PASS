import { ListService, PagedResultDto, QueryStreamCreatorCallback } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { CommonService, GeneTypingAlgorithmService } from '@proxy/app-services';
import { GeneTypingAlgorithmDto } from '@proxy/dtos';

@Component({
  selector: 'app-gene-typing-algorithm',
  templateUrl: './gene-typing-algorithm.component.html',
  styleUrl: './gene-typing-algorithm.component.scss',
  providers: [ListService],
})

export class GeneTypingAlgorithmComponent implements OnInit{

  constructor(
    public readonly list: ListService,
    private algorithmService: GeneTypingAlgorithmService,
    private commonService: CommonService,
    ) { }

    algorithmStreamCreator: QueryStreamCreatorCallback<GeneTypingAlgorithmDto, null>;

  algorithmLst = { items: [], totalCount: 0 } as PagedResultDto<GeneTypingAlgorithmDto>;

  selectedAlgorithm: any;
  filteredAlgorithms: any[] | undefined;
  algorithms: any[] | undefined;
  algorithmName:string = "";

  ngOnInit() {
    const algorithmStreamCreator = (query) => this.algorithmService.getList(query);

    this.list.hookToQuery(algorithmStreamCreator).subscribe((response) => {
      this.algorithmLst = response;
    });

    this.algorithms = [];
    this.getAllAlgorithms();

    this.algorithmStreamCreator = (query) => this.algorithmService.getListWithFilter(this.algorithmName,query);
    this.list.hookToQuery(this.algorithmStreamCreator).subscribe((response) => {
      this.algorithmLst = response;
      console.log(this.algorithmLst)
      // this.fmtDateTime();
    });
  }

  // Init algorithms
  getAllAlgorithms(){
    this.commonService.getAllAlgorithms().subscribe((data:GeneTypingAlgorithmDto[])=>{
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        this.algorithms.push({ label: item.name, value: item });
      }
    })
  }

  searchWithFilter(event:Event){
    console.log("click");
    console.log(this.selectedAlgorithm)
    if(this.selectedAlgorithm==undefined){
      this.algorithmName = ""
    }else if(this.selectedAlgorithm.value==undefined){
      this.algorithmName = this.selectedAlgorithm;
    }else{
      this.algorithmName = this.selectedAlgorithm.value.name;
    }
    console.log(this.algorithmName)
     // Table
    this.list.hookToQuery(this.algorithmStreamCreator).subscribe((response) => {
      this.algorithmLst = response;
    });
    

  }
}

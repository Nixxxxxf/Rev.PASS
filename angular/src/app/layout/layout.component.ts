import { Component, EventEmitter, OnInit } from '@angular/core';
import { ListService, PagedResultDto, QueryStreamCreatorCallback } from '@abp/ng.core';
import { CommonService } from '@proxy/app-services/common.service';
import { LayoutService } from '@proxy/app-services/layout.service';
import { LiquidPositionInPlateDto, PlateDto } from '@proxy/dtos';
import * as echarts from 'echarts';
import { LiquidService } from '@proxy/app-services';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: [ListService],
})


export class LayoutComponent implements OnInit {
  constructor(
    private commonService: CommonService, 
    private layoutService:LayoutService,
    private liquidService:LiquidService,
    public readonly list: ListService,
    ) { }

  wellClickEvent: EventEmitter<any> = new EventEmitter<any>();

  // Select plates box
  selectedPlate: any;
  filteredPlates: any[] | undefined;
  plates: any[] | undefined;

  // Plate details table
  liquidPositions = { items: [], totalCount: 0 } as PagedResultDto<LiquidPositionInPlateDto>;
  sameCpdLst: LiquidPositionInPlateDto[] = [];  

  liquidPositionStreamCreator: QueryStreamCreatorCallback<LiquidPositionInPlateDto, null>;

  plateName:string="";
  
  ngOnInit() {
    this.plates = [];

    this.getAllPlates();
    
    this.wellClickEvent.subscribe((data:any) => {
      console.log('wellClickEvent triggered!');
      this.initCellResultMapChart(data);
    });

    //this.liquidPositionStreamCreator = (query) => this.layoutService.getPlateDetailsForTable(this.plateName, query);
    this.liquidPositionStreamCreator = (query) => this.liquidService.getLiquidPositionInPlate(this.plateName, "", query);

  }

  //////////////////////////////////////////////////////////////////////////////////////////
  //    Search pannel
  //////////////////////////////////////////////////////////////////////////////////////////

  // Init plates
  getAllPlates(){
    this.commonService.getAllPlates().subscribe((data:PlateDto[])=>{
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        this.plates.push({ label: item.name, value: item });
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

  // Click search button, init charts
  searchPlateDetails(event:Event){

    console.log("click");
    
    if(this.selectedPlate.value==undefined){
      this.plateName = this.selectedPlate;
    }else{
      this.plateName = this.selectedPlate.value.name;
    }

    // Table
    this.list.hookToQuery(this.liquidPositionStreamCreator).subscribe((response) => {
      this.liquidPositions = response;
    });
    

    // Chart
    this.layoutService.getPlateDetailsForChart(this.plateName).subscribe((data) => {
      this.initCellResultMapChart(data);
    })


  }




  //////////////////////////////////////////////////////////////////////////////////////////
  //    Chart pannel
  //////////////////////////////////////////////////////////////////////////////////////////

  // Cell result map chart

  generateCols(size:number){
    var cols = [];
    if (size==96) {
      cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    }else if(size==384){

    }else if(size==1536){

    }else{
        console.log("size error: "+ size)
        return null;
    }
    return cols;
  }

  generateRows(size:number){
    var rows = [];
    if (size==96) {
      rows = ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A',]
    }else if(size==384){

    }else if(size==1536){

    }else{
        console.log("size error: "+ size)
        return null;
    }
    return rows;
  }



  initCellResultMapChart(lpLst:LiquidPositionInPlateDto[]) {
    console.log("init Cell Result Map chart")
    var chartDom = document.getElementById('cell-result-map-chart');
    var myChart = echarts.init(chartDom);
    var option;
    var resultMin=100000;
    var resultMax=0;

    if(lpLst.length==0){
      return;
    }

    var size = lpLst[0].plateChildFk.plateFk.plateSize;
    const cols = this.generateCols(size);
    const rows = this.generateRows(size);

    //console.log(lpLst)
    // this.liquidPositionLst = lpLst;
    // console.log(this.liquidPositionLst);
    var data = [];
    for (var c = 0; c < cols.length; c++) {
      for (var r = 0; r < rows.length; r++) {
        var row = rows[r]
        var col = cols[c] - 1
        var lp = lpLst.find(x=>(x.plateChildFk.column==cols[c]&&x.plateChildFk.row==row));
        if(lp!=undefined){
          data.push([col, row, lp.liquidFk.result])
          // data.push(
          //   {
          //     value: [col, row, lp.liquidFk.result],
          //     label: {
                
          //     },
          //     itemStyle:{}
          // }
          // )
          resultMin = Math.min(resultMin,lp.liquidFk.result)
          resultMax = Math.max(resultMax,lp.liquidFk.result)

        }
      }
    }

    option = {
      title: {
        text: ' Cell plate result map',
        left: 'center'
      },
      tooltip: {
        position: 'top'
      },
      grid: {
        height: '50%',
        top: '10%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: cols,
        position: 'top',
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: rows,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: resultMin,
        max: resultMax,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%'
      },
      series: [
        {
          name: 'Well',
          type: 'heatmap',
          data: data,
          label: {
            show: true,
            
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            
          },
          
        }
      ]
    };

    myChart.on('click', function (params) {
      console.log(params);
      let col = params.data[0]+1
      let row = params.data[1]
      let lp = lpLst.find(x=>(x.plateChildFk.column==col&&x.plateChildFk.row==row));
      // find compound
      let lc = lp.liquidFk.liquidCategoryFk.name;
      let lcLst = lc.split(">>")
      let compound = lcLst[0];
      let sameCpdLst = lpLst.filter(function filterLp(lp:LiquidPositionInPlateDto):boolean{
        let lc = lp.liquidFk.liquidCategoryFk.name;
        let lcLst = lc.split(">>")
        if (lcLst[0]==compound) {
          return true;

        }else{
          return false;
        }
      })

      sameCpdLst = sameCpdLst.sort((a,b)=>a.liquidFk.concentration-b.liquidFk.concentration)
      
      console.log(sameCpdLst);
      initIC50Chart(sameCpdLst);
    });

    
    const initIC50Chart = (sameCpdLst:LiquidPositionInPlateDto[]): void => {
      //initIC50Chart(this.liquidPositionLst, params);
      console.log("init IC50 Chart")
      console.log(sameCpdLst);  
      this.sameCpdLst = sameCpdLst;
      console.log(this.sameCpdLst);
      
      var chartDom = document.getElementById('ic-50-chart');
      var myChart = echarts.init(chartDom);
      var option;
    
      if(sameCpdLst.length==0){
        return;
      }
    
      let data = [];
      
      for (let i = 0; i < sameCpdLst.length; i++) {
        let item = sameCpdLst[i];
        data.push([item.liquidFk.concentration,item.liquidFk.result])
      }


      option = {
        xAxis: {
          //type: 'value',
          type: 'log',
          name:"Conc."
        },
        yAxis: {
          type: 'value',
          name:"Result"
        },
        series: [
          {
            data: data,
            type: 'line',
            smooth: true,
            symbol:"rect",
            symbolSize:20
          }
        ]
      };
      
    
      option && myChart.setOption(option);
    };

    option && myChart.setOption(option);

  }


  



  // initPlateTraceChart() {
  //   console.log("init Plate Trace chart")
  //   var chartDom = document.getElementById('plate-trace-chart');
  //   var myChart = echarts.init(chartDom);
  //   var option;

  //   var data = [];
  //   var dataCount = 10;
  //   var startTime = +new Date();
  //   var categories = ['Plate_A', 'Plate_B', 'Plate_C'];
  //   var types = [
  //     { name: 'Incubator', color: '#7b9ce1' },
  //     { name: 'Echo', color: '#bd6d6c' },
  //     { name: 'Robotic', color: '#75d874' },
  //     { name: 'Shaker', color: '#e0bc78' },
  //     { name: 'XPeel', color: '#dc77dc' },
  //     { name: 'Barcode reader', color: '#72b362' }
  //   ];
  //   // Generate mock data
  //   categories.forEach(function (category, index) {
  //     var baseTime = startTime;
  //     for (var i = 0; i < dataCount; i++) {
  //       var typeItem = types[Math.round(Math.random() * (types.length - 1))];
  //       var duration = Math.round(Math.random() * 10000);
  //       data.push({
  //         name: typeItem.name,
  //         value: [index, baseTime, (baseTime += duration), duration],
  //         itemStyle: {
  //           normal: {
  //             color: typeItem.color
  //           }
  //         }
  //       });
  //       baseTime += Math.round(Math.random() * 2000);
  //     }
  //   });
  //   function renderItem(params, api) {
  //     var categoryIndex = api.value(0);
  //     var start = api.coord([api.value(1), categoryIndex]);
  //     var end = api.coord([api.value(2), categoryIndex]);
  //     var height = api.size([0, 1])[1] * 0.6;
  //     var rectShape = echarts.graphic.clipRectByRect(
  //       {
  //         x: start[0],
  //         y: start[1] - height / 2,
  //         width: end[0] - start[0],
  //         height: height
  //       },
  //       {
  //         x: params.coordSys.x,
  //         y: params.coordSys.y,
  //         width: params.coordSys.width,
  //         height: params.coordSys.height
  //       }
  //     );
  //     return (
  //       rectShape && {
  //         type: 'rect',
  //         transition: ['shape'],
  //         shape: rectShape,
  //         style: api.style()
  //       }
  //     );
  //   }
  //   option = {
  //     tooltip: {
  //       formatter: function (params) {
  //         return params.marker + params.name + ': ' + params.value[3] + ' ms';
  //       }
  //     },
  //     title: {
  //       text: 'Plate trace',
  //       left: 'center'
  //     },
  //     dataZoom: [
  //       {
  //         type: 'slider',
  //         filterMode: 'weakFilter',
  //         showDataShadow: false,
  //         top: 400,
  //         labelFormatter: ''
  //       },
  //       {
  //         type: 'inside',
  //         filterMode: 'weakFilter'
  //       }
  //     ],
  //     grid: {
  //       height: '50%',
  //       top: '10%',
  //       left: '3%',
  //       right: '4%',
  //       bottom: '3%',
  //       containLabel: true
  //     },
  //     xAxis: {
  //       min: startTime,
  //       scale: true,
  //       axisLabel: {
  //         formatter: function (val) {
  //           return Math.max(0, val - startTime) + ' ms';
  //         }
  //       }
  //     },
  //     yAxis: {
  //       data: categories
  //     },
  //     series: [
  //       {
  //         type: 'custom',
  //         renderItem: renderItem,
  //         itemStyle: {
  //           opacity: 0.8
  //         },
  //         encode: {
  //           x: [1, 2],
  //           y: 0
  //         },
  //         data: data
  //       }
  //     ]
  //   };

  //   option && myChart.setOption(option);

  // }


}

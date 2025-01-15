import { Component, EventEmitter, OnInit } from '@angular/core';
import { ListService, PagedResultDto, QueryStreamCreatorCallback } from '@abp/ng.core';
import { CommonService } from '@proxy/app-services/common.service';
import { LayoutService } from '@proxy/app-services/layout.service';
import { GeneTypingAlgorithmDto, LiquidPositionInPlateDto, PlateDto } from '@proxy/dtos';
import * as echarts from 'echarts';
import { LiquidService } from '@proxy/app-services';
import ecStat from 'echarts-stat';
import { ScatterChart } from 'echarts/charts';
import { OpCompoundLibraryService } from '@proxy/open-app-service';


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
    private opCompoundLibraryService:OpCompoundLibraryService,
    public readonly list: ListService,
    ) { }

  wellClickEvent: EventEmitter<any> = new EventEmitter<any>();

  // Select plates box
  selectedPlate: any;
  filteredPlates: any[] | undefined;
  plates: any[] | undefined;

  // Select plates box
  selectedAlgorithm: any;
  algorithms: any[] | undefined;

  // Plate details table
  liquidPositions = { items: [], totalCount: 0 } as PagedResultDto<LiquidPositionInPlateDto>;
  sameCpdLst: LiquidPositionInPlateDto[] = [];  
  lpLst: LiquidPositionInPlateDto[] = [];  //

  // 

  liquidPositionStreamCreator: QueryStreamCreatorCallback<LiquidPositionInPlateDto, null>;

  plateName:string="";
  
  ngOnInit() {
    this.plates = [];
    this.algorithms = [];

    this.getAllPlates();
    this.getAllAlgorithms();
    
    this.wellClickEvent.subscribe((data:any) => {
      console.log('wellClickEvent triggered!');
      // this.initResultMapChart(data,"FAM");
      // this.initResultMapChart(data,"HEX");
      // this.initResultMapChart(data,"ROX");
    });

    this.liquidPositionStreamCreator = (query) => this.liquidService.getLiquidPositionInPlate(this.plateName, "", query);
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  //    Search pannel
  //////////////////////////////////////////////////////////////////////////////////////////

  // Init plates, algorithms
  getAllPlates(){
    this.commonService.getAllPlates().subscribe((data:PlateDto[])=>{
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        this.plates.push({ label: item.name, value: item });
      }
    })
  }

  getAllAlgorithms(){
    this.commonService.getAllAlgorithms().subscribe((data:GeneTypingAlgorithmDto[])=>{
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        this.algorithms.push({ label: item.name, value: item.name });
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
      this.initResultMapChart(data,"FAM");
      this.initResultMapChart(data,"HEX");
      this.initResultMapChart(data,"ROX");
      this.lpLst = data;

    })


  }

  // click generate button
  generateScatterChart(event:Event){
    this.opCompoundLibraryService.callPythonAlgorithmKMeanByPlateName(this.plateName).subscribe((data)=>{
      console.log("generateScatterChart");
      console.log(data);
      this.initResultScatterChart(this.lpLst);

    })
  }
  




  //////////////////////////////////////////////////////////////////////////////////////////
  //    Chart pannel
  //////////////////////////////////////////////////////////////////////////////////////////

  // result map chart

  initResultMapChart(lpLst:LiquidPositionInPlateDto[], signal:string) {

    console.log(`init ${signal} chart`)
    var chartDom = document.getElementById(`result-map-chart-${signal}`);
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

    var data = [];
    for (var c = 0; c < cols.length; c++) {
      for (var r = 0; r < rows.length; r++) {
        var row = rows[r]
        var col = cols[c] - 1
        var lp = lpLst.find(x=>(x.plateChildFk.column==cols[c]&&x.plateChildFk.row==row));
        if(lp!=undefined){
          let result;
          if (signal=="FAM"){result = Math.floor(lp.liquidFk.fam/1000)}
          if (signal=="HEX"){result = Math.floor(lp.liquidFk.hex/1000)}
          if (signal=="ROX"){result = Math.floor(lp.liquidFk.rox/1000)}

          data.push([col, row, result])
          resultMin = Math.min(resultMin,result)
          resultMax = Math.max(resultMax,result)

        }
      }
    }

    option = {
      title: {
        text: signal,
        left: 'center'
      },
      tooltip: {
        position: 'top'
      },
      grid: {
        height: '65%',
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
        bottom: '10%'
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
      let sLst = lpLst.filter(function filterLp(lp:LiquidPositionInPlateDto):boolean{
        let lc = lp.liquidFk.liquidCategoryFk.name;
        let lcLst = lc.split(">>")
        if (lcLst[0]==compound) {
          return true;

        }else{
          return false;
        }
      })

      sLst = sLst.sort((a,b)=>a.liquidFk.concentration-b.liquidFk.concentration)
      
      console.log(sLst);
      updateSameCpdLst(sLst);
    });

    const updateSameCpdLst = (sameCpdLst:LiquidPositionInPlateDto[]): void => {
      //initIC50Chart(this.liquidPositionLst, params);
      console.log("updateSameCpdLst")
      console.log(sameCpdLst);  
      this.sameCpdLst = sameCpdLst;
    };
    
    

    option && myChart.setOption(option);

  }


  
  // scatter chart
  initResultScatterChart(lpLst:LiquidPositionInPlateDto[]) {

    console.log(`init scatter chart`)
    var chartDom = document.getElementById(`result-scatter-chart`);
    var myChart = echarts.init(chartDom);
    var option;

    var CLUSTER_COUNT = 4;
    var DIENSIION_CLUSTER_INDEX = 2;
    var COLOR_ALL = [
      '#37A2DA',
      '#e06343',
      '#37a354',
      '#b55dba',
      '#b5bd48',
      '#8378EA',
      '#96BFFF'
    ];

    var pieces = [];
    for (var i = 1; i < CLUSTER_COUNT+1; i++) {
      pieces.push({
        value: i,
        label: 'cluster ' + i,
        color: COLOR_ALL[i-1]
      });
    }

    if(lpLst.length==0){
      return;
    }

    var size = lpLst[0].plateChildFk.plateFk.plateSize;
    const cols = this.generateCols(size);
    const rows = this.generateRows(size);

    var data = [];

    let controlWell = lpLst.find(x=>(x.plateChildFk.column==2 && x.plateChildFk.row=="A"));

    for (var c = 0; c < cols.length; c++) {
      for (var r = 0; r < rows.length; r++) {
        var row = rows[r]
        var col = cols[c] - 1
        var lp = lpLst.find(x=>(x.plateChildFk.column==cols[c]&&x.plateChildFk.row==row));
        if(lp!=undefined){
          let fam = lp.liquidFk.fam;
          let hex = lp.liquidFk.hex;
          let rox = lp.liquidFk.rox;

          let x = (fam**2) / (rox- controlWell.liquidFk.rox);
          let y = (hex**2) / (rox- controlWell.liquidFk.rox);
          data.push([x, y])

        }
      }
    }


    ////xxxxxxxxxxxxxxxxxxxxxxx
    var clusters = [
      {
          "label": "Cluster 1",
          "color": "#ff7f50",
          "data": [
              [1, 2], [3, 4], [5, 6]
          ],
          "well": ["A1","B1","C1"]
      },
      {
          "label": "Cluster 2",
          "color": "#87cefa",
          "data": [
              [7, 8], [9, 10], [11, 12]
          ],
          "well": ["A1","B1","C1"]
      }
  ];


  option = {
      title: {
          text: 'KMeans'
      },
      legend: {
          data: clusters.map(function(cluster) { return cluster.label; })
      },
      tooltip: {
          trigger: 'item',
          formatter: function(params) {
              var cluster = clusters[params.seriesIndex];
              var data = cluster.data[params.dataIndex];
              var well = cluster.well[params.dataIndex];
              return 'Cluster: ' + cluster.label + '<br/>' +
                    'Data: (' + well+ ')';
          }
      },
      xAxis: {},
      yAxis: {},
      series: clusters.map(function(cluster) {
          return {
              name: cluster.label,
              type: 'scatter', // 使用散点图类型
              itemStyle: {
                  color: cluster.color
              },
              data: cluster.data
          };
      })
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);

/////xxxxxxxxxxxxxxxxxxxxxxxxx

    // option = {
    //   dataset: [
    //     {
    //       source: data
    //     },
    //     {
    //       transform: {
    //         type: 'scatter',
    //         // print: true,
    //         config: {
    //           clusterCount: CLUSTER_COUNT,
    //           outputType: 'single',
    //           outputClusterIndexDimension: DIENSIION_CLUSTER_INDEX
    //         }
    //       }
    //     }
    //   ],
    //   tooltip: {
    //     position: 'top'
    //   },
    //   visualMap: {
    //     type: 'piecewise',
    //     top: 'middle',
    //     min: 0,
    //     max: CLUSTER_COUNT,
    //     left: 10,
    //     splitNumber: CLUSTER_COUNT,
    //     dimension: DIENSIION_CLUSTER_INDEX,
    //     pieces: pieces
    //   },
    //   grid: {
    //     left: 120
    //   },
    //   xAxis: {},
    //   yAxis: {},
    //   series: {
    //     type: 'scatter',
    //     encode: { tooltip: [0, 1] },
    //     symbolSize: 15,
    //     itemStyle: {
    //       borderColor: '#555'
    //     },
    //     datasetIndex: 1
    //   }
    // };

    // myChart.on('click', function (params) {
    //   console.log(params);
    //   let col = params.data[0]+1
    //   let row = params.data[1]
    //   let lp = lpLst.find(x=>(x.plateChildFk.column==col&&x.plateChildFk.row==row));
    //   // find compound
    //   let lc = lp.liquidFk.liquidCategoryFk.name;
    //   let lcLst = lc.split(">>")
    //   let compound = lcLst[0];
    //   let sLst = lpLst.filter(function filterLp(lp:LiquidPositionInPlateDto):boolean{
    //     let lc = lp.liquidFk.liquidCategoryFk.name;
    //     let lcLst = lc.split(">>")
    //     if (lcLst[0]==compound) {
    //       return true;

    //     }else{
    //       return false;
    //     }
    //   })

    //   sLst = sLst.sort((a,b)=>a.liquidFk.concentration-b.liquidFk.concentration)
      
    //   console.log(sLst);
    //   updateXXX(sLst);
    // });

    
    

    option && myChart.setOption(option);

  }






  //////////////////////////////////////////////////////////////////////////////////////////
  //    Utility
  //////////////////////////////////////////////////////////////////////////////////////////

  generateCols(size:number){
    var cols = [];
    if (size==96) {
      cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    }else if(size==384){
      cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
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
      rows = ['P', 'O', 'N', 'M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A',]
    }else if(size==1536){

    }else{
        console.log("size error: "+ size)
        return null;
    }
    return rows;
  }
}











// const initIC50Chart = (sameCpdLst:LiquidPositionInPlateDto[]): void => {
//   //initIC50Chart(this.liquidPositionLst, params);
//   console.log("init IC50 Chart")
//   console.log(sameCpdLst);  
//   this.sameCpdLst = sameCpdLst;
//   console.log(this.sameCpdLst);
  
//   var chartDom = document.getElementById('ic-50-chart');
//   var myChart = echarts.init(chartDom);
//   var option;

//   if(sameCpdLst.length==0){
//     return;
//   }

//   let data = [];
  
//   for (let i = 0; i < sameCpdLst.length; i++) {
//     let item = sameCpdLst[i];
//     data.push([item.liquidFk.concentration,item.liquidFk.result])
//   }


//   option = {
//     xAxis: {
//       //type: 'value',
//       type: 'log',
//       name:"Conc."
//     },
//     yAxis: {
//       type: 'value',
//       name:"Result"
//     },
//     series: [
//       {
//         data: data,
//         type: 'line',
//         smooth: true,
//         symbol:"rect",
//         symbolSize:20
//       }
//     ]
//   };
  

//   option && myChart.setOption(option);
// };



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

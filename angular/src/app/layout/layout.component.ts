import { Component, EventEmitter, OnInit } from '@angular/core';
import { ListService, PagedResultDto, QueryStreamCreatorCallback } from '@abp/ng.core';
import { CommonService } from '@proxy/app-services/common.service';
import { LayoutService } from '@proxy/app-services/layout.service';
import { ClusterResultInput, GeneTypingAlgorithmDto, LiquidPositionInPlateDto, PlateDto } from '@proxy/dtos';
import * as echarts from 'echarts';
import { LiquidService } from '@proxy/app-services';
import ecStat from 'echarts-stat';
import { ScatterChart } from 'echarts/charts';
import { OpCompoundLibraryService } from '@proxy/open-app-service';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';


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

  // cluster chart
  clusterChart:any;
  clusterOption:any;
  clusterDom:any;
  COLOR_ALL:any[];
  seriesIndex:number=0;



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
  generateClusterChart(event:Event){
    this.opCompoundLibraryService.callPythonAlgorithmKMeanByPlateName(this.plateName).subscribe((data)=>{
      console.log("generateClusterChart");
      console.log(typeof(data));

      console.log(data);
      this.initResultClusterChart(this.lpLst, data);
      this.onClickPoint();
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


  
  // cluster chart
  initResultClusterChart(lpLst:LiquidPositionInPlateDto[], output:string) {

    var jsonObject = JSON.parse(output);
    //console.log(jsonObject)

    var erroCode = jsonObject.ErrorCode;
    //console.log(`erroCode ${erroCode}`)

    if(erroCode != 1){
      console.log(jsonObject.ErrorMessage);
      return;
    }
    var entity = JSON.parse(jsonObject.ErrorMessage);
    //console.log(`entity ${entity}`)
    //console.log(`entity type ${typeof(entity)}`)
    var wellNames = entity.WellNames;
    var xList = entity.X;
    var yList = entity.Y;
    var labels = entity.ClusterLabels;
    var clustersNum = entity.Clusters;
    var controlWell = entity.ControlWell;

    //console.log(`wellNames ${wellNames}`)
    //console.log(`xList ${xList}`)
    //console.log(`yList ${yList}`)
    console.log(`labels ${labels}`)
    //console.log(`clustersNum ${clustersNum}`)
    //console.log(`controlWell ${controlWell}`)
    xList = xList.map((x) => x / 10**7);
    yList = yList.map((x) => x / 10**7);

    console.log(`init cluster chart`)
    this.clusterDom = document.getElementById(`result-cluster-chart`);
    this.clusterChart = echarts.init(this.clusterDom);
    //this.clusterOption;

    var CLUSTER_COUNT = 4;
    this.COLOR_ALL = [
      '#96BFFF',
      '#37A2DA',
      '#e06343',
      '#37a354',
      '#b55dba',
      '#b5bd48',
      '#8378EA',
    ];

    var legends = [];
    for (var i = 1; i < CLUSTER_COUNT+1; i++) {
      legends.push(
        `Cluster ${i}`
      );
    }

  
    var clusters = [];
    for (let i = 0; i < wellNames.length; i++) {
      clusters.push(
        {
          "label": `Cluster ${labels[i]}`,
          "color": this.COLOR_ALL[labels[i]],
          "data": [[xList[i],yList[i]]],
          "well": wellNames[i]
        }
      )
    }


    this.clusterOption = {
      title: {
          text: 'K-Means'
      },
      legend: {
          data: legends//clusters.map(function(cluster) { return cluster.label; })
      },
      tooltip: {
          trigger: 'item',
          formatter: function(params) {
              var cluster = clusters[params.seriesIndex];
              var data = cluster.data//[params.dataIndex];
              var well = cluster.well//[params.dataIndex];
              return 'Cluster: ' + cluster.label + '<br/>' +
                    'Well: (' + well+ ')';
          }
      },
      xAxis: {name: 'FAM'},
      yAxis: {name: 'HEX'},
      animation: true,
      series: clusters.map(function(cluster) {
          return {
              id: cluster.well,
              name: cluster.label,
              symbolSize: 15,
              type: 'scatter', 
              itemStyle: {
                  color: cluster.color
              },
              data: cluster.data
          };
      })
    };

    this.clusterOption && this.clusterChart.setOption(this.clusterOption);
    console.log(this.clusterOption)
  }


  onClickPoint(){
    // click event
    this.clusterChart.on('click', (params) =>{
      console.log(params);
      var pointId = params["seriesId"];

      // 获取当前点击的点的索引和系列
      this.seriesIndex = params.seriesIndex;
      var dataIndex = params.dataIndex;

      console.log(this.seriesIndex);

      
      
      
    });
  }

  changeCluster1(event:Event){
    this.changeCluster(1);
  }
  changeCluster2(event:Event){
    this.changeCluster(2);
  }
  changeCluster3(event:Event){
    this.changeCluster(3);
  }
  changeCluster4(event:Event){
    this.changeCluster(4);
  }

  changeCluster(cluster:number){
    var prePoint = this.clusterOption.series[this.seriesIndex]
    var curPoint = prePoint
    curPoint.name = `Cluster ${cluster}`
    curPoint.itemStyle.color = this.COLOR_ALL[cluster]
    this.clusterOption.series[this.seriesIndex] = curPoint
    this.clusterChart.clear();
    this.clusterOption.animation=false;
    this.clusterChart.setOption(this.clusterOption)
  }


  exportCSV(){
    console.log(this.clusterOption.series);
    let itemLst: Array<ClusterResultInput>=[];
    for (let i = 0; i < this.clusterOption.series.length; i++) {
      let item: ClusterResultInput={};
      item.plateName = this.plateName
      item.wellName = this.clusterOption.series[i].id
      //item.x = this.clusterOption.series[i].data[0][0]
      //item.y = this.clusterOption.series[i].data[0][1]
      let clusterName = this.clusterOption.series[i].name
      let lastChar = clusterName[clusterName.length - 1]; 
      item.cluster = parseInt(lastChar, 10);
      console.log(item)
      itemLst.push(item);
    }


    this.opCompoundLibraryService.exportClusterResultCsvByInputs(itemLst).subscribe((data)=>{
      console.log("exportClusterResultCsv");
    })
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

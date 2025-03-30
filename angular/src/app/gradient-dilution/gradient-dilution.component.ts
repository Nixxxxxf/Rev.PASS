import { ListService, PagedResultDto, QueryStreamCreatorCallback } from '@abp/ng.core';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { CommonService, CsvHeaderService, ProtocolService } from '@proxy/app-services';
import { CsvHeaderDto, ProtocolDto } from '@proxy/dtos';
import * as echarts from 'echarts';


@Component({
  selector: 'app-gradient-dilution',
  templateUrl: './gradient-dilution.component.html',
  styleUrl: './gradient-dilution.component.scss',
  providers: [ListService],
})

export class GradientDilutionComponent implements OnInit{//AfterViewInit {

  constructor(
    private commonService: CommonService, 
    private protocolService: ProtocolService,
    public readonly list: ListService,
    ) { }
    
  protocolStreamCreator: QueryStreamCreatorCallback<ProtocolDto, null>;

  // nav
  currentStep = 0;
  steps = [
    { title: 'Protocol Select', content: 'Content for Step 0' },
    { title: 'Source Plate', content: 'Content for Step 1' },
    { title: 'Control Plate', content: 'Content for Step 2' },
    { title: 'Intermediate Plate', content: 'Content for Step 3' },
    { title: 'Destination Plate', content: 'Content for Step 4' },
    { title: 'Export', content: 'Content for Step 5' },
  ];

  // protocol
  proList: ProtocolDto[] = [];
  selectedPro: ProtocolDto={};
  newPro: string="";
  showResetPro:boolean = false;
  showNonePro:boolean = false;
  proContent:ProtocolContent;
  plateList:Plate[]=[];

  // sp chart list
  spChart:any;
  spOption:any;
  spDom:any;
  spList:Plate[]=[];
  spSize:number=384;
  selectedSP:Plate;
  spCurrentIndex:number=-1;
  spCurrentPoint:number[]=[];
  spIsSetArea:boolean=false;
  spStartRow:string="A";
  spEndRow:string="P";
  spStartCol:number=1;
  spEndCol:number=24;

  // cp chart
  cpChart:any;
  cpOption:any;
  cpDom:any;
  cpList:Plate[]=[];
  cpSize:number=384;
  selectedCP:Plate;
  cpCurrentIndex:number=-1;
  cpCurrentPoint:number[]=[];
  cpIsSetArea:boolean=false;
  cpStartRow:string="A";
  cpEndRow:string="P";
  cpStartCol:number=1;
  cpEndCol:number=24;


  // ip chart
  ipChart:any;
  ipOption:any;
  ipDom:any;
  ipList:Plate[]=[];
  ipSize:number=384;
  selectedIP:Plate;
  ipCurrentIndex:number=-1;
  ipCurrentPoint:number[]=[];
  ipIsSetArea:boolean=false;
  ipStartRow:string="A";
  ipEndRow:string="P";
  ipStartCol:number=1;
  ipEndCol:number=24;

  // ip params
  interMaxTransfer:number=1000;
  interMinTransfer:number=2.5;
  bulkFill:number=15;
  maxInterPlateNum:number=1;
  maxInterConcenNum:number=2;

  reagentVolume:number=0;
  solvent:number=100;
  destMaxTransfer:number=200;
  concenTolerance:number=10;
  curveReplicates:number=1;
  destinationCopies: number=1;

  sampleConcentration: number=10;
  startConcentration: number=10;
  dilutionFactor: number=3;
  dataPoints: number=8;
  ipConUnitSample:string="uM";
  ipConUnitStart:string="uM";

  //ip tabs
  activeTab = 0;
  theoreticalList:any[]=[];
  actualList:any[]=[];
  intermediateList:any[]=[];


  // dp chart list
  dpChart:any;
  dpOption:any;
  dpDom:any;
  dpList:Plate[]=[];
  dpSize:number=384;
  selectedDP:Plate;
  dpCurrentIndex:number=-1;
  dpCurrentPoint:number[]=[];
  dpIsSetArea:boolean=false;
  dpStartRow:string="A";
  dpEndRow:string="P";
  dpStartCol:number=1;
  dpEndCol:number=24;

  //modal
  deleteHidden:boolean=true;



  ngOnInit(): void {
    this.initProtocolList();
  }



  //////////////////////////////////////////////////////////////////////////////////////////
  //    pro list
  //////////////////////////////////////////////////////////////////////////////////////////
  initProtocolList(){
    console.log("initProtocolList");
    this.protocolService.getAllProtocolsForSelect().subscribe((data)=>{
      console.log(data);
      this.proList = data;
    })
  }

  createNewProtocol(){
    console.log("createNewProtocol");
    this.protocolService.addNewProtocolByName(this.newPro).subscribe((data)=>{
      this.initProtocolList();
    })
  }

  selectProtocol(){
    console.log("selectProtocol");
  }

  deleteProtocol(){
    console.log("deleteProtocol");
    this.protocolService.deleteProtocolByName(this.selectedPro.name).subscribe((data)=>{
      this.initProtocolList();
    })
  }

  saveProtocol(){
    console.log("saveProtocol");
    let pltLst = [];
    pltLst.push(...this.spList);
    pltLst.push(...this.cpList);
    pltLst.push(...this.ipList);
    pltLst.push(...this.dpList);

    let ipParams:Parameter={
      interMaxTransfer:this.interMaxTransfer,
      interMinTransfer:this.interMinTransfer,
      bulkFill:this.bulkFill,
      maxInterPlateNum:this.maxInterPlateNum,
      maxInterConcenNum:this.maxInterConcenNum,

      reagentVolume:this.reagentVolume,
      destMaxTransfer:this.destMaxTransfer,

      concenTolerance:this.concenTolerance,
      curveReplicates:this.curveReplicates,
      destinationCopies:this.destinationCopies,

      sampleConcentration:this.sampleConcentration,
      startConcentration:this.startConcentration,
      dilutionFactor:this.dilutionFactor,
      dataPoints:this.dataPoints,
    }

    let content:ProtocolContent={
      parameter:ipParams,
      plateList:pltLst
    }

    this.selectedPro.content = JSON.stringify(content); 
    console.log(content)
    this.protocolService.createOrUpdateProtocolByPro(this.selectedPro).subscribe((data)=>{
      this.initProtocolList();
      this.currentStep = 0;
      this.previousStep();
    })
  }


  //////////////////////////////////////////////////////////////////////////////////////////
  //    sp chart
  //////////////////////////////////////////////////////////////////////////////////////////


  initSPList(){
    // first time init
    this.proContent = JSON.parse(this.selectedPro.content);
    this.spList = [];
    this.plateList = this.proContent.plateList;
    if(this.plateList==null){
      this.plateList = [];
    }
    for (let index = 0; index < this.plateList.length; index++) {
      const p = this.plateList[index];
      if (p.name.includes("SP")) {
        this.spList.push(p);
      }
    }
    console.log(this.spList);
  }

  createNewSP(){
    // find max order
    let maxNumber = 0;
    for (const plate of this.spList) {
      const nameParts = plate.name.split("_");
      if (nameParts.length === 2 && !isNaN(Number(nameParts[1]))) {
          const number = Number(nameParts[1]);
          if (number > maxNumber) {
              maxNumber = number;
          }
      }
    }
    const newNumber = maxNumber + 1;
    const newName = `SP_${newNumber}`;
    const cols = this.generateCols(this.spSize);
    const rows = this.generateRows(this.spSize);
    var wellLst = [];
    for (var c = 0; c < cols.length; c++) {
      for (var r = 0; r < rows.length; r++) {
        const well:Well={
          row: rows[r],
          col: cols[c],
          type: 3 //available
        }
        wellLst.push(well);
      }
    }
    const newPlate: Plate = {
        name: newName,
        barcode: "", 
        wells: wellLst
    };
    this.spList.push(newPlate);
    console.log("Updated plateList:", this.spList);
  }


  deleteSP(){
    var newLst = []
    this.spList.forEach(x=>{
      if(x.name!=this.selectedSP.name){
        newLst.push(x)
      }
    })
    this.spList = newLst;
  }


  // on select sp chart
  initSPChart() {
    console.log(`initSPChart`)
    this.spDom = document.getElementById(`sp-chart`);
    this.spChart = echarts.init(this.spDom);
    if(this.selectedSP==null){
      return;
    }
    var data = [];
    this.selectedSP.wells.forEach(well => {
      data.push([well.col-1,well.row,well.type]) // well to data:     col 1==>0
    });

    this.spOption = this.setOption(this.selectedSP.name, this.spSize, data);
    this.spOption && this.spChart.setOption(this.spOption);
    this.onSPClickPoint();
  }

  onSPClickPoint(){
    this.spChart.on('click', (params) =>{
      this.spCurrentIndex = params.dataIndex;
      this.spCurrentPoint = this.spOption.series[0].data[this.spCurrentIndex]
      console.log(`this.spCurrentPoint: ${this.spCurrentPoint}`);
    });
  }

  // general set index to type
  setSPPoint(type: number){
    console.log(`spIsSetArea: ${this.spIsSetArea}`);
    if(this.spIsSetArea){
      var newData = []
      this.spOption.series[0].data.forEach(e => {
        if(this.checkInArea(e[1],e[0]+1,this.spStartCol,this.spEndCol,this.spStartRow,this.spEndRow)){   // col check, need +1
          newData.push([e[0],e[1],type])
        }else{
          newData.push(e)
        };
      });
      this.spOption.series[0].data = newData
    }else{
      var prePoint = this.spOption.series[0].data[this.spCurrentIndex]
      var curPoint=[prePoint[0],prePoint[1],type]
      this.spOption.series[0].data[this.spCurrentIndex] = curPoint
    }
    this.spChart.clear();
    this.spOption.animation=false;
    this.spChart.setOption(this.spOption)
    this.updateSPList();//option changed=>change spList 
  }

  setSPPointSample(){
    this.setSPPoint(0)
  }

  setSPPointControl(){
    this.setSPPoint(1)
  }

  setSPPointSolvent(){
    this.setSPPoint(4)
  }

  setSPPointReserved(){
    this.setSPPoint(2)
  }

  setSPPointAvailable(){
    this.setSPPoint(3)
  }

  updateSPList(){
    console.log("updateSPList")
    var wellLst=[];
    this.spOption.series[0].data.forEach(e => {
      const well:Well={
        row: e[1],
        col: e[0]+1, //data to well, col+1
        type: e[2]
      }
      wellLst.push(well)
    });
    this.selectedSP.wells = wellLst
    var newSPList = []
    for (let index = 0; index < this.spList.length; index++) {
      const oldSp = this.spList[index];
      if (oldSp.name==this.selectedSP.name){
        newSPList.push(this.selectedSP)
      }else{
        newSPList.push(oldSp)
      }
    }
    this.spList = newSPList;
    console.log("this.spList")
    console.log(this.spList)
  }


  // general
  setOption(chartName:string, plateSize:number, data:any){
    var visualMap;
    if (chartName.includes("SP")) {
      visualMap = {
        min: 0,
        max: 5,
        type: 'piecewise', // 使用分段型视觉映射
        pieces: [
          { min: 0, max: 0, color: 'rgb(255, 0, 0)' },      // sample
          { min: 1, max: 1, color: 'rgb(0, 191, 255)' },    // control
          { min: 2, max: 2, color: 'rgb(116, 116, 116)' },  // reserved
          { min: 3, max: 3, color: 'rgb(240, 240, 240)' },   // available
          { min: 4, max: 4, color: 'rgb(255, 255, 0)' }, // solvent

        ],
        orient: 'horizontal',
        left: 'center',
        bottom: '10%'
      }
    }else if(chartName.includes("CP")){
      visualMap = {
        min: 0,
        max: 3,
        type: 'piecewise',
        pieces: [
          { min: 1, max: 1, color: 'rgb(0, 191, 255)' },    // control
          { min: 2, max: 2, color: 'rgb(116, 116, 116)' },  // reserved
          { min: 3, max: 3, color: 'rgb(240, 240, 240)' },   // available
        ],
        orient: 'horizontal',
        left: 'center',
        bottom: '10%'
      }
    }else if(chartName.includes("IP")){
        visualMap = {
          min: 0,
          max: 5,
          type: 'piecewise',
          pieces: [
            { min: 2, max: 2, color: 'rgb(116, 116, 116)' },  // reserved
            { min: 3, max: 3, color: 'rgb(240, 240, 240)' },   // available
            { min: 5, max: 5, color: 'rgb(255, 165, 0)' },      // bulk fill
          ],
          orient: 'horizontal',
          left: 'center',
          bottom: '10%'
      }
    }else if(chartName.includes("DP")){
        visualMap = {
          min: 0,
          max: 5,
          type: 'piecewise',
          pieces: [
            { min: 1, max: 1, color: 'rgb(0, 191, 255)' },    // control
            { min: 2, max: 2, color: 'rgb(116, 116, 116)' },  // reserved
            { min: 3, max: 3, color: 'rgb(240, 240, 240)' },   // available
            { min: 4, max: 4, color: 'rgb(255, 255, 0)' }, // solvent

          ],
          orient: 'horizontal',
          left: 'center',
          bottom: '10%'
      }
    }
    
    const cols = this.generateCols(plateSize);
    const rows = this.generateRows(plateSize);

    var option = {
      title: {
        text: chartName,
        left: 'center'
      },
      tooltip: {
        position: 'top'
      },
      legend: {
        show: false
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
      visualMap: visualMap,
      series: [
        {
          name: 'Well',
          type: 'heatmap',
          data: data,
          label: {
            show: true,
            formatter: function (params) {
              // 根据数值显示对应的字母
              const letters = ['S', 'C', 'R', 'A', "V", "B"];
              return letters[params.value[2]];
            }
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
    return option;
  }


  //////////////////////////////////////////////////////////////////////////////////////////
  //    cp chart
  //////////////////////////////////////////////////////////////////////////////////////////

  initCPList(){
    console.log("initCPList")
    this.cpList = [];
    console.log(this.proContent.plateList)
    console.log(this.plateList)
    //this.plateList = this.proContent.plateList;
    for (let index = 0; index < this.plateList.length; index++) {
      const p = this.plateList[index];
      if (p.name.includes("CP")) {
        this.cpList.push(p);
      }
    }
    console.log(this.cpList);
  }

  createNewCP(){
    // find max order
    let maxNumber = 0;
    for (const plate of this.cpList) {
      const nameParts = plate.name.split("_");
      if (nameParts.length === 2 && !isNaN(Number(nameParts[1]))) {
          const number = Number(nameParts[1]);
          if (number > maxNumber) {
              maxNumber = number;
          }
      }
    }
    const newNumber = maxNumber + 1;
    const newName = `CP_${newNumber}`;
    const cols = this.generateCols(this.cpSize);
    const rows = this.generateRows(this.cpSize);
    var wellLst = [];
    for (var c = 0; c < cols.length; c++) {
      for (var r = 0; r < rows.length; r++) {
        const well:Well={
          row: rows[r],
          col: cols[c],
          type: 3 //available
        }
        wellLst.push(well);
      }
    }
    const newPlate: Plate = {
        name: newName,
        barcode: "", 
        wells: wellLst
    };
    this.cpList.push(newPlate);
    console.log("Updated plateList:", this.cpList);
  }

  deleteCP(){
    var newLst = []
    this.cpList.forEach(x=>{
      if(x.name!=this.selectedCP.name){
        newLst.push(x)
      }
    })
    this.cpList = newLst;
  }

  // on select cp chart
  initCPChart() {
    console.log(`initCPChart`)
    this.cpDom = document.getElementById(`cp-chart`);
    this.cpChart = echarts.init(this.cpDom);
    if(this.selectedCP==null){
      return;
    }
    var data = [];
    this.selectedCP.wells.forEach(well => {
      data.push([well.col-1,well.row,well.type]) // well to data:     col 1==>0
    });

    this.cpOption = this.setOption(this.selectedCP.name, this.cpSize, data);
    this.cpOption && this.cpChart.setOption(this.cpOption);
    this.onCPClickPoint();
  }

  onCPClickPoint(){
    this.cpChart.on('click', (params) =>{
      this.cpCurrentIndex = params.dataIndex;
      this.cpCurrentPoint = this.cpOption.series[0].data[this.cpCurrentIndex]
      console.log(`this.cpCurrentPoint: ${this.cpCurrentPoint}`);
    });
  }

  // general set index to type
  setCPPoint(type: number){
    console.log(`cpIsSetArea: ${this.cpIsSetArea}`);
    if(this.cpIsSetArea){
      var newData = []
      this.cpOption.series[0].data.forEach(e => {
        if(this.checkInArea(e[1],e[0]+1,this.cpStartCol,this.cpEndCol,this.cpStartRow,this.cpEndRow)){   // col check, need +1
          newData.push([e[0],e[1],type])
        }else{
          newData.push(e)
        };
      });
      this.cpOption.series[0].data = newData
    }else{
      var prePoint = this.cpOption.series[0].data[this.cpCurrentIndex]
      var curPoint=[prePoint[0],prePoint[1],type]
      this.cpOption.series[0].data[this.cpCurrentIndex] = curPoint
    }
    this.cpChart.clear();
    this.cpOption.animation=false;
    this.cpChart.setOption(this.cpOption)
    this.updateCPList();//option changed=>change cpList 
  }

  setCPPointControl(){
    this.setCPPoint(1)
  }

  setCPPointReserved(){
    this.setCPPoint(2)
  }

  setCPPointAvailable(){
    this.setCPPoint(3)
  }

  updateCPList(){
    var wellLst=[];
    this.cpOption.series[0].data.forEach(e => {
      const well:Well={
        row: e[1],
        col: e[0]+1, //data to well, col+1
        type: e[2]
      }
      wellLst.push(well)
    });
    this.selectedCP.wells = wellLst
    var newCPList = []
    for (let index = 0; index < this.cpList.length; index++) {
      const oldCp = this.cpList[index];
      if (oldCp.name==this.selectedCP.name){
        newCPList.push(this.selectedCP)
      }else{
        newCPList.push(oldCp)
      }
    }
    this.cpList = newCPList;
  }


  //////////////////////////////////////////////////////////////////////////////////////////
  //    ip chart
  //////////////////////////////////////////////////////////////////////////////////////////

  initParams(){
    let ipParams = this.proContent.parameter;
    if (ipParams==null){
      return;
    }
    this.interMaxTransfer=ipParams.interMaxTransfer
    this.interMinTransfer=ipParams.interMinTransfer
    this.bulkFill=ipParams.bulkFill
    this.maxInterPlateNum=ipParams.maxInterPlateNum
    this.maxInterConcenNum=ipParams.maxInterConcenNum
    this.reagentVolume=ipParams.reagentVolume
    this.destMaxTransfer=ipParams.destMaxTransfer
    this.concenTolerance=ipParams.concenTolerance
    this.curveReplicates=ipParams.curveReplicates
    this.destinationCopies=ipParams.destinationCopies
    this.sampleConcentration=ipParams.sampleConcentration
    this.startConcentration=ipParams.startConcentration
    this.dilutionFactor=ipParams.dilutionFactor
    this.dataPoints=ipParams.dataPoints


  }


  initIPList(){
    this.initParams();
    this.ipList = [];
    this.plateList = this.proContent.plateList;
    for (let index = 0; index < this.plateList.length; index++) {
      const p = this.plateList[index];
      if (p.name.includes("IP")) {
        this.ipList.push(p);
      }
    }
    console.log(this.ipList);
  }

  createNewIP(){
    // find max order
    let maxNumber = 0;
    for (const plate of this.ipList) {
      const nameParts = plate.name.split("_");
      if (nameParts.length === 2 && !isNaN(Number(nameParts[1]))) {
          const number = Number(nameParts[1]);
          if (number > maxNumber) {
              maxNumber = number;
          }
      }
    }
    const newNumber = maxNumber + 1;
    const newName = `IP_${newNumber}`;
    const cols = this.generateCols(this.ipSize);
    const rows = this.generateRows(this.ipSize);
    var wellLst = [];
    for (var c = 0; c < cols.length; c++) {
      for (var r = 0; r < rows.length; r++) {
        const well:Well={
          row: rows[r],
          col: cols[c],
          type: 3 //available
        }
        wellLst.push(well);
      }
    }
    const newPlate: Plate = {
        name: newName,
        barcode: "", 
        wells: wellLst
    };
    this.ipList.push(newPlate);
    console.log("Updated plateList:", this.ipList);
  }

  deleteIP(){
    var newLst = []
    this.ipList.forEach(x=>{
      if(x.name!=this.selectedIP.name){
        newLst.push(x)
      }
    })
    this.ipList = newLst;
  }

  // on select ip chart
  initIPChart() {
    console.log(`initIPChart`)
    this.ipDom = document.getElementById(`ip-chart`);
    this.ipChart = echarts.init(this.ipDom);
    if(this.selectedIP==null){
      return;
    }
    var data = [];
    this.selectedIP.wells.forEach(well => {
      data.push([well.col-1,well.row,well.type]) // well to data:     col 1==>0
    });

    this.ipOption = this.setOption(this.selectedIP.name, this.ipSize, data);
    this.ipOption && this.ipChart.setOption(this.ipOption);
    this.onIPClickPoint();
  }

  onIPClickPoint(){
    this.ipChart.on('click', (params) =>{
      this.ipCurrentIndex = params.dataIndex;
      this.ipCurrentPoint = this.ipOption.series[0].data[this.ipCurrentIndex]
      console.log(`this.ipCurrentPoint: ${this.ipCurrentPoint}`);
    });
  }

  // general set index to type
  setIPPoint(type: number){
    console.log(`ipIsSetArea: ${this.ipIsSetArea}`);
    if(this.ipIsSetArea){
      var newData = []
      this.ipOption.series[0].data.forEach(e => {
        if(this.checkInArea(e[1],e[0]+1,this.ipStartCol,this.ipEndCol,this.ipStartRow,this.ipEndRow)){   // col check, need +1
          newData.push([e[0],e[1],type])
        }else{
          newData.push(e)
        };
      });
      this.ipOption.series[0].data = newData
    }else{
      var prePoint = this.ipOption.series[0].data[this.ipCurrentIndex]
      var curPoint=[prePoint[0],prePoint[1],type]
      this.ipOption.series[0].data[this.ipCurrentIndex] = curPoint
    }
    this.ipChart.clear();
    this.ipOption.animation=false;
    this.ipChart.setOption(this.ipOption)
    this.updateIPList();//option changed=>change ipList 
  }

  setIPPointBulkFill(){
    this.setIPPoint(5)
  }

  setIPPointReserved(){
    this.setIPPoint(2)
  }

  setIPPointAvailable(){
    this.setIPPoint(3)
  }

  updateIPList(){
    var wellLst=[];
    this.ipOption.series[0].data.forEach(e => {
      const well:Well={
        row: e[1],
        col: e[0]+1, //data to well, col+1
        type: e[2]
      }
      wellLst.push(well)
    });
    this.selectedIP.wells = wellLst
    var newIPList = []
    for (let index = 0; index < this.ipList.length; index++) {
      const oldIp = this.ipList[index];
      if (oldIp.name==this.selectedIP.name){
        newIPList.push(this.selectedIP)
      }else{
        newIPList.push(oldIp)
      }
    }
    this.ipList = newIPList;
  }



  //////////////////////////////////////////////////////////////////////////////////////////
  //    dp chart
  //////////////////////////////////////////////////////////////////////////////////////////

  initDPList(){
    this.dpList = [];
    this.plateList = this.proContent.plateList;
    for (let index = 0; index < this.plateList.length; index++) {
      const p = this.plateList[index];
      if (p.name.includes("DP")) {
        this.dpList.push(p);
      }
    }
    console.log(this.dpList);
  }

  createNewDP(){
    // find max order
    let maxNumber = 0;
    for (const plate of this.dpList) {
      const nameParts = plate.name.split("_");
      if (nameParts.length === 2 && !isNaN(Number(nameParts[1]))) {
          const number = Number(nameParts[1]);
          if (number > maxNumber) {
              maxNumber = number;
          }
      }
    }
    const newNumber = maxNumber + 1;
    const newName = `DP_${newNumber}`;
    const cols = this.generateCols(this.dpSize);
    const rows = this.generateRows(this.dpSize);
    var wellLst = [];
    for (var c = 0; c < cols.length; c++) {
      for (var r = 0; r < rows.length; r++) {
        const well:Well={
          row: rows[r],
          col: cols[c],
          type: 3 //available
        }
        wellLst.push(well);
      }
    }
    const newPlate: Plate = {
        name: newName,
        barcode: "", 
        wells: wellLst
    };
    this.dpList.push(newPlate);
    console.log("Updated plateList:", this.dpList);
  }

  deleteDP(){
    var newLst = []
    this.dpList.forEach(x=>{
      if(x.name!=this.selectedDP.name){
        newLst.push(x)
      }
    })
    this.dpList = newLst;
  }

  // on select dp chart
  initDPChart() {
    console.log(`initDPChart`)
    this.dpDom = document.getElementById(`dp-chart`);
    this.dpChart = echarts.init(this.dpDom);
    if(this.selectedDP==null){
      return;
    }
    var data = [];
    this.selectedDP.wells.forEach(well => {
      data.push([well.col-1,well.row,well.type]) // well to data:     col 1==>0
    });

    this.dpOption = this.setOption(this.selectedDP.name, this.dpSize, data);
    this.dpOption && this.dpChart.setOption(this.dpOption);
    this.onDPClickPoint();
  }

  onDPClickPoint(){
    this.dpChart.on('click', (params) =>{
      this.dpCurrentIndex = params.dataIndex;
      this.dpCurrentPoint = this.dpOption.series[0].data[this.dpCurrentIndex]
      console.log(`this.dpCurrentPoint: ${this.dpCurrentPoint}`);
    });
  }

  // general set index to type
  setDPPoint(type: number){
    console.log(`dpIsSetArea: ${this.dpIsSetArea}`);
    if(this.dpIsSetArea){
      var newData = []
      this.dpOption.series[0].data.forEach(e => {
        if(this.checkInArea(e[1],e[0]+1,this.dpStartCol,this.dpEndCol,this.dpStartRow,this.dpEndRow)){   // col check, need +1
          newData.push([e[0],e[1],type])
        }else{
          newData.push(e)
        };
      });
      this.dpOption.series[0].data = newData
    }else{
      var prePoint = this.dpOption.series[0].data[this.dpCurrentIndex]
      var curPoint=[prePoint[0],prePoint[1],type]
      this.dpOption.series[0].data[this.dpCurrentIndex] = curPoint
    }
    this.dpChart.clear();
    this.dpOption.animation=false;
    this.dpChart.setOption(this.dpOption)
    this.updateDPList();//option changed=>change dpList 
  }

  setDPPointControl(){
    this.setDPPoint(1)
  }

  setDPPointSolvent(){
    this.setDPPoint(4)
  }

  setDPPointReserved(){
    this.setDPPoint(2)
  }

  setDPPointAvailable(){
    this.setDPPoint(3)
  }

  updateDPList(){
    var wellLst=[];
    this.dpOption.series[0].data.forEach(e => {
      const well:Well={
        row: e[1],
        col: e[0]+1, //data to well, col+1
        type: e[2]
      }
      wellLst.push(well)
    });
    this.selectedDP.wells = wellLst
    var newDPList = []
    for (let index = 0; index < this.dpList.length; index++) {
      const oldDp = this.dpList[index];
      if (oldDp.name==this.selectedDP.name){
        newDPList.push(this.selectedDP)
      }else{
        newDPList.push(oldDp)
      }
    }
    this.dpList = newDPList;
  }








  //////////////////////////////////////////////////////////////////////////////////////////
  //    nav
  //////////////////////////////////////////////////////////////////////////////////////////
  nextStep() {

    if(this.currentStep==0){
      if(this.selectedPro==null||this.selectedPro==undefined){
        console.log("Please select a protocol.")
        this.showNonePro=true;
        setTimeout(() => {
          this.showNonePro = false;
        }, 2000); 
        return;
      }
    }

    if (this.currentStep < this.steps.length) {
      this.currentStep++;
    }

    if (this.currentStep === 1) {
      this.initSPList();
    }
    if (this.currentStep === 2) {
      this.initCPList();
    }
    if (this.currentStep === 3) {
      this.initIPList();
    }
    if (this.currentStep === 4) {
      this.initDPList();
    }

  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
    if (this.currentStep==0) {
      this.showResetPro=true;
      setTimeout(() => {
        this.showResetPro = false;
      }, 2000); 
      this.selectedPro=null

      this.resetAll();
      this.initProtocolList();

    }
  }


  resetAll(){
    // protocol
    this.proList = [];
    this.selectedPro={};
    this.newPro="";
    this.showResetPro= false;
    this.showNonePro = false;
    this.proContent=null;
    this.plateList=[];

    // sp chart list
    this.spChart=null;
    this.spOption=null;
    this.spDom=null;
    this.spList=[];
    this.spSize=384;
    this.selectedSP=null;
    this.spCurrentIndex=-1;
    this.spCurrentPoint=[];
    this.spIsSetArea=false;
    this.spStartRow="A";
    this.spEndRow="P";
    this.spStartCol=1;
    this.spEndCol=24;

    

  }



  //////////////////////////////////////////////////////////////////////////////////////////
  //    deleteModal
  //////////////////////////////////////////////////////////////////////////////////////////
  




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
      cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48]
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
      rows = ['AF','AE','AD','AC','AB','AA','Z','Y','X','W','V','U','T','S','R','Q','P', 'O', 'N', 'M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A',]
    }else{
        console.log("size error: "+ size)
        return null;
    }
    return rows;
  }

  checkInArea(row:string, col:number,st_col:number,ed_col:number,st_row:string,ed_row:string):boolean{
    const cols = this.generateCols(this.spSize);
    const rows = this.generateRows(this.spSize).reverse();

    var stRowI = rows.indexOf(st_row.toUpperCase())
    var edRowI = rows.indexOf(ed_row.toUpperCase())
    var stColI = cols.indexOf(st_col)
    var edColI = cols.indexOf(ed_col)


    var rowI = rows.indexOf(row)
    var colI = cols.indexOf(col)

    if (stColI==-1||edColI==-1||stRowI==-1||edRowI==-1){
      console.log("start/end row/col not in range.")
      return false;
    }

    if (rowI==-1||colI==-1){
      console.log("check row/col not in range.")
      return false;
    }

    if (rowI<stRowI ||rowI>edRowI){
      return false;
    }

    if (colI<stColI ||colI>edColI){
      return false
    }
    // console.log(`check | row index ${rows.indexOf(row)}, col index ${cols.indexOf(col)}`)
    // console.log(`spStartCol index ${cols.indexOf(this.spStartCol)}, spEndCol index ${rows.indexOf(this.spEndCol)}`)
    // console.log(`in area | row index ${rowI}, col index ${colI}`)

    return true;
  }






  //////////////////////////////////////////////////////////////////////////////////////////
  //    IP Tabs
  // interMaxTransfer:number=1000;
  // interMinTransfer:number=2.5;
  // bulkFill:number=15;
  // maxInterPlateNum:number=1;
  // maxInterConcenNum:number=3;

  // reagentVolume:number=0;
  // destMaxTransfer:number=200;
  // concenTolerance:number=10;
  // curveReplicates:number=1;
  // destinationCopies: number=1;

  // sampleConcentration: number=10;
  // startConcentration: number=10;
  // dilutionFactor: number=3;
  // dataPoints: number=8;
  // ipConUnitSample:string="uM";
  // ipConUnitStart:string="uM";
  //////////////////////////////////////////////////////////////////////////////////////////

  setActiveTab(index: number): void {
    this.activeTab = index;
  }

  generateIPTable(){
    console.log("generateIPTable")
    let MaxInterConcenNum = 2                       //this.maxInterConcenNum
    const ConcenTolerance = 10                        //this.concenTolerance
    let ReagentVolume = 0//this.reagentVolume=40*uL
    let DilutionFactor = 3                          //this.dilutionFactor
    let DataPoints = 8                              //this.dataPoints
    let MinTransVol = this.interMinTransfer*nL      //2.5*nL
    let InterMaxTransfer = 1000*nL                  //this.interMaxTransfer*nL//1000*nL
    let MaxTransVol = 40*nL                         //this.destMaxTransfer*nL//197.5*nL
    let MinTransStep = this.interMinTransfer*nL     //2.5*nL

    let SourceConcentration = 10*mM                 //this.sampleConcentration*mM//1*10**1*mM
    let StartConcentration = 10*mM                  //this.startConcentration*mM//100*uM
    let BulkFillVol = 15*uL//this.bulkFill*uL              //15*uL

    this.solvent = Math.round(MaxTransVol*100/(ReagentVolume+MaxTransVol)*100)/100  //%
    let Solvent = this.solvent/100
    console.log(`Solvent: ${Solvent}`)
    let InterAllFinalConcenLst = []
    let TheorConcenLst = []
    let CurrentConcen = 0


    //# Theoretical concentration
    for (let i = 0; i < DataPoints; i++) {
      CurrentConcen = StartConcentration/(DilutionFactor**(i))
      TheorConcenLst.push(CurrentConcen)
      this.theoreticalList.push(
        {
          concentration:CurrentConcen.toExponential(3)
        }
      )
    }

    let TheorConcenLstNoSol = [] //without solvent
    TheorConcenLst.forEach(x=>{TheorConcenLstNoSol.push(x/Solvent)})


    // find best inter point
    let allPoints = []
    let tempInterPoints = []
    let realInterPoints = []

    //SourceConcentration = SourceConcentration*Solvent
    if (SourceConcentration*Solvent!=StartConcentration*Solvent){
      allPoints = [SourceConcentration]
    }
      // [source, start, theore1, theore2, ...theore(N-1)] len=n+1 
    allPoints.push(...TheorConcenLstNoSol) //Solvent
    console.log(allPoints)

    //firstly, InterAllFinalConcenLst only contains source point
    InterAllFinalConcenLst.push(SourceConcentration)
    this.actualList = [];
    this.intermediateList = []

    let allPointsFound = [] //where find the final vol and error<10()

    // first time to get final trans
    console.log("======================first time======================")
    const [newAllPointsFound, newActualList] = getFinalTransList(allPoints,allPointsFound,InterAllFinalConcenLst,MaxTransVol,MinTransStep,ConcenTolerance)
    newActualList.forEach(e => {this.actualList.push(e)});
    allPointsFound = newAllPointsFound;

    // loop inter times
    console.log("======================loop time======================")
    for (let t = 0; t < MaxInterConcenNum; t++) {
      console.log(`t:${t}, allPoints: ${allPoints}`)
      console.log(`t:${t}, allPointsFound: ${allPointsFound}`)
      console.log(`t:${t}, InterAllFinalConcenLst: ${InterAllFinalConcenLst}`)
      console.log(`t:${t}, SourceConcentration: ${SourceConcentration}`)
      const [newInterAllFinalConcenLst, newIntermediate] = getInterTransList(allPoints,allPointsFound,InterAllFinalConcenLst,SourceConcentration,InterMaxTransfer,BulkFillVol,MinTransStep,ConcenTolerance)
      console.log(`t:${t}, newInterAllFinalConcenLst: ${newInterAllFinalConcenLst}`)

      InterAllFinalConcenLst = newInterAllFinalConcenLst
      this.intermediateList.push(newIntermediate)

      const [newAllPointsFound, newActualList] = getFinalTransList(allPoints,allPointsFound,InterAllFinalConcenLst,MaxTransVol,MinTransStep,ConcenTolerance)
      console.log(`t:${t}, newAllPointsFound: ${newAllPointsFound}, newActualList:${newActualList}`)

      newActualList.forEach(e => {this.actualList.push(e)});
      allPointsFound = newAllPointsFound;
    }

    // find last without errorcon
    console.log("======================last time======================")
    const [new2AllPointsFound, new2ActualList] = getFinalTransList(allPoints,allPointsFound,InterAllFinalConcenLst,MaxTransVol,MinTransStep,100)
    console.log(new2ActualList)
    new2ActualList.forEach(e => {this.actualList.push(e)});
    allPointsFound = new2AllPointsFound;

    console.log(`InterAllFinalConcenLst :${InterAllFinalConcenLst}`)
    console.log(`allPointsFound :${allPointsFound}`)

    console.log(this.actualList)
    console.log(this.intermediateList)
    
    // reorder list
    this.actualList.sort((a, b) => {
      if (a.TheoreConcen === b.TheoreConcen) {
        return a.ErrorConcen - b.ErrorConcen; //  Ascending order for 'ErrorConcen' if 'TheoreConcen' is the same
      }
      return b.TheoreConcen - a.TheoreConcen; // Descending order for 'TheoreConcen'
    });

    console.log(this.actualList)

    // Step 2: Remove duplicates based on 'TheoreConcen', keeping the one with the smaller 'TheoreConcen'
    const finalActualList: any[] = [];
    const seen = new Set<number>();

    for (const item of this.actualList) {
      if (!seen.has(item.TheoreConcen)) {
        finalActualList.push(item);
        seen.add(item.TheoreConcen);
      }
    }

    this.actualList = finalActualList;
    console.log(this.actualList)





  }


  generateIPLayout(){
    //1. (samples+controls)*interListNum
    
  }


  generateDPLayout(){

  }










}













//////////////////////////////////////////////////////////////////////////////////////////
//    Dilution algorithm
//////////////////////////////////////////////////////////////////////////////////////////



const M = 10 ** 3;
const mM = 1;
const uM = 10 ** (-3);
const nM = 10 ** (-6);

const L = 10 ** (9);
const mL = 10 ** (6);
const uL = 10 ** (3);
const nL = 1;

function InterTransVol(
  SourceConcen: number,
  InterConcen: number,
  BulkfillVol: number,
  MaxTransVol: number,
  MinTransStep: number,
  MinError:number,
  // Solvent:number,
): [number, number, number] {
  let TransVol = 0;
  let TmpConcen = 0;
  let ErrorConcen = 100;
  let TransVolResult = 0;
  let RealConcen = 0;

  while (TransVol <= MaxTransVol) {
      TmpConcen = Math.round(SourceConcen * (TransVol / (BulkfillVol + TransVol)) * 1e10) / 1e10;
      const TmpErrorConcen = Math.round(((TmpConcen - InterConcen) / InterConcen) * 1e5) / 1e5 * 100;
      if (Math.abs(TmpErrorConcen) < Math.abs(ErrorConcen)) {
          ErrorConcen = TmpErrorConcen;
          TransVolResult = TransVol;
          RealConcen = TmpConcen;
      }
      TransVol += MinTransStep * nL;
  }

  // if (Math.abs(ErrorConcen) < MinError) {
  //     console.log(`${SourceConcen}mM | ${TransVolResult}nL | ${InterConcen}mM | ${BulkfillVol}nL    :${RealConcen}mM, ${ErrorConcen}%`);
  // }

  return [TransVolResult, RealConcen, ErrorConcen];
}


function FinalTransVol(
  SourceConcen: number,
  TheoreConcen: number,
  MaxTransVol: number,
  MinTransStep: number,
  MinError:number,
  // Solvent:number,
): [number, number, number, number, number, number] {
  let TransVol = 0;
  let FinalConcen = 0;
  let TmpConcen = 0;
  let ErrorConcen = 100;
  let TransVolResult = 0;
  let RealConcen = 0;
  let BackfillVol = 0;

  while (TransVol <= MaxTransVol) {
      TmpConcen = Math.round(SourceConcen * (TransVol / MaxTransVol) * 1e10 ) / 1e10;
      //console.log(`TmpConcen: ${TmpConcen}`)
      //const TmpErrorConcen = Math.round(((TmpConcen - TheoreConcen) / TheoreConcen) * 1e5) / 1e5 * 100;
      const TmpErrorConcen = Math.round(((TmpConcen - TheoreConcen) / TmpConcen) * 1e5) / 1e5 * 100;
      if (Math.abs(TmpErrorConcen) < Math.abs(ErrorConcen)) {
          ErrorConcen = TmpErrorConcen;
          TransVolResult = TransVol;
          BackfillVol = MaxTransVol - TransVolResult;
          RealConcen = TmpConcen;
      }
      TransVol += MinTransStep * nL;
  }

  if (Math.abs(ErrorConcen) < MinError) {
      console.log(`${SourceConcen}mM | ${TransVolResult}nL | ${BackfillVol}nL | ${TheoreConcen}mM | ${RealConcen}mM | ${ErrorConcen}% `);
  }else{
    //console.log(`cannot find good transefer volume error: ${SourceConcen}mM | ${TheoreConcen}mM`)
  }


  return [SourceConcen, TransVolResult, BackfillVol, TheoreConcen, RealConcen, ErrorConcen];
}

function getFinalTransList(
  allPoints:number[],
  allPointsFound:number[],
  InterAllFinalConcenLst: number[],
  MaxTransVol:number, 
  MinTransStep:number, 
  ConcenTolerance:number,
  // Solvent:number,
):[number[],any[]]{
  let actualList = []
  for (let i = 0; i < allPoints.length; i++) {
    let theorPoint = allPoints[i];
    if (allPointsFound.indexOf(theorPoint)==-1) {
      for (let k = 0; k < InterAllFinalConcenLst.length; k++) {
        let interCon = InterAllFinalConcenLst[k];
        const [SourceConcen, TransVolResult, BackfillVol, TheoreConcen, RealConcen, ErrorConcen] = FinalTransVol(interCon, theorPoint, MaxTransVol, MinTransStep, ConcenTolerance)
        if (Math.abs(ErrorConcen)<ConcenTolerance) {
          allPointsFound.push(theorPoint)
          let Comment = ""
          if (ConcenTolerance==100){ Comment = "Out of limit"} //last step, out of limit
          let actualEntity={
            SourceConcen:SourceConcen.toExponential(3),
            TransVolResult:TransVolResult,
            BackfillVol:BackfillVol,
            TheoreConcen:TheoreConcen.toExponential(3),
            RealConcen:RealConcen.toExponential(3),
            ErrorConcen:Math.round(ErrorConcen*100)/100,
            Comment:Comment,
          }
          actualList.push(actualEntity)
        }
      }
    }
  }

  return [allPointsFound, actualList]
}

function getInterTransList(
  allPoints:number[],
  allPointsFound:number[],
  InterAllFinalConcenLst: number[],
  SourceConcen: number,
  InterMaxTransfer: number,
  BulkfillVol: number,
  MinTransStep: number,
  ConcenTolerance:number,
  // Solvent:number,
):[number[],any]{
  let result ={}
  // if no suitable inter points, to get 1
  for (let i = 0; i < allPoints.length; i++) {
    let theorPoint = allPoints[i];
    if (allPointsFound.indexOf(theorPoint)==-1) {
      // go to find intermediate, the first point as the inter point
      const [TransVolResult, RealConcen, ErrorConcen] = InterTransVol(SourceConcen, theorPoint, BulkfillVol, InterMaxTransfer, MinTransStep, ConcenTolerance)
      if (Math.abs(ErrorConcen)<ConcenTolerance){
        InterAllFinalConcenLst.push(RealConcen)
        result = {
          SourceConcen:SourceConcen,
          TransVolResult:TransVolResult,
          FinalConcen:RealConcen.toExponential(3),
          BulkfillVol:BulkfillVol
        }
        console.log(`found inter SourceConcen:${SourceConcen}, TransVolResult:${TransVolResult}, RealConcen:${RealConcen}, ErrorConcen:${ErrorConcen}`)
        break;
      }
    }
  }
  

  return [InterAllFinalConcenLst, result]

}



function tableActual(
  SourceConcen: number,
  TransVol: number,
  BackfillVol: number,
  TheoreConcen: number,
  FinalConcen: number
): void {
  const ErrorConcen = Math.round(((FinalConcen - TheoreConcen) / TheoreConcen) * 1e5) / 1e5 * 100;
  //console.log(`${SourceConcen} | ${TransVol} | ${BackfillVol} | ${TheoreConcen} | ${FinalConcen} | ${ErrorConcen}%`);
}


function dilute(
  SourceConcen: number,
  TransVol: number,
  BulkfillVol: number
): number {
  const FinalConcen = Math.round(SourceConcen * (TransVol / (BulkfillVol + TransVol)) * 1e5) / 1e5;
  //console.log(`${SourceConcen} | ${TransVol} | ${FinalConcen} | ${BulkfillVol}`);
  return FinalConcen;
}


// function findClosest(nums: number[], target: number): number {
//   if (nums.length === 0) {
//     //throw new Error("list is null");
//     console.log("list is null");
//   }
//   let left: number = 0;
//   let right: number = nums.length - 1;
//   while (left < right) {
//     const mid: number = Math.floor((left + right) / 2);
//     if (nums[mid] > target) {
//       left = mid + 1;
//     } else {
//       right = mid;
//     }
//   }
//   if (left === 0) {
//     return nums[0];
//   }
//   if (left === nums.length) {
//     return nums[nums.length - 1];
//   }
//   const leftVal: number = nums[left - 1];
//   const rightVal: number = nums[left];
//   return Math.abs(leftVal - target) <= Math.abs(rightVal - target) ? leftVal : rightVal;
// }









//////////////////////////////////////////////////////////////////////////////////////////
//    Interface
//////////////////////////////////////////////////////////////////////////////////////////

interface ProtocolContent{
  parameter: Parameter;
  plateList: Plate[];
}


interface Parameter {
  //ip
  interMaxTransfer:number; //Per Point Max Transfer Volume
  interMinTransfer:number; //Per Point Min Transfer Volume
  bulkFill: number; //Constant Bulkfill Volume
  maxInterPlateNum:number; //Max Number of Intermediate Templates
  maxInterConcenNum:number; //Max number of Concentrations Per Template

  //dp
  reagentVolume:number; //Add Assay Reagent Volume 
  destMaxTransfer:number; //Per Point Max Transfer Volume

  concenTolerance:number; //Per Point Voncentration Tolerance(+/-%)
  curveReplicates:number; //Number of Curve Replicates
  destinationCopies: number; //Number of Destination Copies

  sampleConcentration: number; // Sample Concentration
  startConcentration: number; //Starting Concentration
  dilutionFactor: number; //Dilution Factor
  dataPoints: number; //Data Points
}


interface Plate {
  name: string;  
  barcode: string;
  wells: Well[]; 
}

interface Well {
  row: string;    
  col: number;    
  type: number;   
}







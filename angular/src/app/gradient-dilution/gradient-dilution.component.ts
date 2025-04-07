import { ListService, PagedResultDto, QueryStreamCreatorCallback, isNullOrEmpty } from '@abp/ng.core';
import { ReturnStatement } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { CommonService, CsvHeaderService, ProtocolService } from '@proxy/app-services';
import { CsvHeaderDto, ProtocolDto } from '@proxy/dtos';
import * as echarts from 'echarts';
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import { CONFIRMATION_ICONS } from '@abp/ng.theme.shared/lib/tokens/confirmation-icons.token';

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
  spFileType:string="";
  spFileContent:any;
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
  interMaxTransfer:number=500;
  interMinTransfer:number=2.5;
  bulkFill:number=14;
  maxInterPlateNum:number=1;
  maxInterConcenNum:number=2;

  reagentVolume:number=40;
  solvent:number=100;
  destMaxTransfer:number=40;
  concenTolerance:number=10;
  destinationCopies: number=1;

  sampleConcentration: number=10;
  startConcentration: number=10;
  dilutionFactor: number=3;
  dataPoints: number=8;
  conUnitSample:string="mM";
  conUnitStart:string="uM";
  curveReplicates:number=1;
  perPlateControlCurve:boolean=true;

  //ip tabs
  activeTab = 0;
  theoreticalList:any[]=[];
  actualList:ActualEntity[]=[];
  intermediateList:IntermediateEntity[]=[];

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

  // dir
  sampleDirection:string="Down"
  curveDirection:string="Across"

  //modal
  deleteHidden:boolean=true;

  //export
  ipPickList:Pick[]=[];
  dpPickList:Pick[]=[];
  allPickList:Pick[]=[];
  barcodeFileType:string="";
  barcodeFileContent:any;
  barcodeMap:Map<string, string>=new Map<string, string>();
  pickListName:string="";


  ngOnInit(): void {
    this.initProtocolList();
  }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Page Logic
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  //////////////////////////////////////////////////////////////////////////////
  //    pro list
  //////////////////////////////////////////////////////////////////////////////

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
      destinationCopies:this.destinationCopies,

      sampleConcentration:this.sampleConcentration,
      conUnitSample:this.conUnitSample,
      startConcentration:this.startConcentration,
      conUnitStart:this.conUnitStart,
      dilutionFactor:this.dilutionFactor,
      dataPoints:this.dataPoints,

      sampleDirection:this.sampleDirection,
      curveDirection:this.curveDirection,

      curveReplicates:this.curveReplicates,
      perPlateControlCurve:this.perPlateControlCurve,
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


  //////////////////////////////////////////////////////////////////////////////
  //    sp chart
  //////////////////////////////////////////////////////////////////////////////

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
    const cols = generateCols(this.spSize);
    const rows = generateRows(this.spSize);
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

  onSourcePlateSelected(event) {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        this.spFileType = "Excel";
      }else if(file.name.endsWith('.csv') ){
        this.spFileType = "Csv";
      }else{
        return; //error
      }
      this.spFileContent = e.target.result;
    };
    reader.readAsBinaryString(file);    
  }


  importIP(){
    let data = parseFile(this.spFileContent, this.spFileType);
    console.log(data)

    this.spList = []

    // push plate
    let createdNames = []
    for (let i = 0; i < data.length; i++) {
      let d = data[i];
      let plateName = `SP_${d.PlateNumber}`
      let plate = createdNames.find(x=>x=plateName)
      if(plate==null){
        let newPlate: Plate={
          name:plateName,
          barcode:"",
          wells:[],
        }
        this.spList.push(newPlate)
        createdNames.push(plateName)
      }
    }

    // create all available
    for (let i = 0; i < this.spList.length; i++) {
      let plate = this.spList[i];
      const cols = generateCols(this.spSize);
      const rows = generateRows(this.spSize);
      var wellLst = [];
      for (var c = 0; c < cols.length; c++) {
        for (var r = 0; r < rows.length; r++) {
          //let wellName = `${rows[r]}${cols[r]}`
          const well:Well={
            row: rows[r],
            col: cols[c],
            type: PointType.Available //available
          }
          wellLst.push(well);
        }
      }
      this.spList[i].wells = wellLst
    }

    console.log("this.spList");
    console.log(this.spList);
    // set sample
    for (let i = 0; i < data.length; i++) {
      let d = data[i];
      let plateName = `SP_${d.PlateNumber}`
      let plateIndex = this.spList.findIndex(x=>x.name==plateName)
      let plate = this.spList[plateIndex]
      console.log("plate")
      console.log(plateName)
      console.log(plateIndex)
      console.log(plate)
      let newWells = []
      plate.wells.forEach(w=>{
        let wellName = `${w.row}${w.col}`
        if (wellName==d.Well) {
          newWells.push({
            row:w.row,
            col:w.col,
            type: PointType.Sample
          })
        }else{
          newWells.push(w)
        }
      })
      this.spList[plateIndex].wells = newWells
    }

    this.selectedSP = this.plateList[0]
    this._updateSPChart()
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

  // general set point type
  setSPPoint(type: number){
    console.log(`spIsSetArea: ${this.spIsSetArea}`);
    if(this.spIsSetArea){
      var newData = []
      this.spOption.series[0].data.forEach(e => {
        if(checkInArea(e[1],e[0]+1,this.spStartCol,this.spEndCol,this.spStartRow,this.spEndRow,this.spSize)){   // col check, need +1
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

  // options ==> this.splist
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

  // general chart option
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
            { min: 0, max: 0, color: 'rgb(255, 0, 0)' },      // sample
            { min: 1, max: 1, color: 'rgb(0, 191, 255)' },    // control
            { min: 2, max: 2, color: 'rgb(116, 116, 116)' },  // reserved
            { min: 3, max: 3, color: 'rgb(240, 240, 240)' },   // available
            { min: 5, max: 5, color: 'rgb(255, 165, 0)' },      // bulk fill
            { min: 6, max: 6, color: 'rgb(120, 191, 255)' },    // control curve
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
            { min: 0, max: 0, color: 'rgb(255, 0, 0)' },      // sample
            { min: 1, max: 1, color: 'rgb(0, 191, 255)' },    // control
            { min: 2, max: 2, color: 'rgb(116, 116, 116)' },  // reserved
            { min: 3, max: 3, color: 'rgb(240, 240, 240)' },   // available
            { min: 4, max: 4, color: 'rgb(255, 255, 0)' },     // solvent
            { min: 6, max: 6, color: 'rgb(120, 191, 255)' },    // control curve

          ],
          orient: 'horizontal',
          left: 'center',
          bottom: '10%'
      }
    }
    
    const cols = generateCols(plateSize);
    const rows = generateRows(plateSize).reverse();

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
              const letters = ['S', 'C', 'R', 'A', "V", "B", "c"];
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


  //////////////////////////////////////////////////////////////////////////////
  //    cp chart
  //////////////////////////////////////////////////////////////////////////////

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
    const cols = generateCols(this.cpSize);
    const rows = generateRows(this.cpSize);
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

  // general set point type
  setCPPoint(type: number){
    console.log(`cpIsSetArea: ${this.cpIsSetArea}`);
    if(this.cpIsSetArea){
      var newData = []
      this.cpOption.series[0].data.forEach(e => {
        if(checkInArea(e[1],e[0]+1,this.cpStartCol,this.cpEndCol,this.cpStartRow,this.cpEndRow,this.cpSize)){   // col check, need +1
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


  //////////////////////////////////////////////////////////////////////////////
  //    ip chart
  //////////////////////////////////////////////////////////////////////////////

  // load db params
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
    this.destinationCopies=ipParams.destinationCopies
    this.sampleConcentration=ipParams.sampleConcentration
    this.conUnitSample=ipParams.conUnitSample
    this.startConcentration=ipParams.startConcentration
    this.conUnitStart=ipParams.conUnitStart
    this.dilutionFactor=ipParams.dilutionFactor
    this.dataPoints=ipParams.dataPoints

    this.sampleDirection=ipParams.sampleDirection
    this.curveDirection=ipParams.curveDirection

    this.curveReplicates=ipParams.curveReplicates
    this.perPlateControlCurve=ipParams.perPlateControlCurve
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
    const cols = generateCols(this.ipSize);
    const rows = generateRows(this.ipSize);
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

  // general set point type
  setIPPoint(type: number){
    console.log(`ipIsSetArea: ${this.ipIsSetArea}`);
    if(this.ipIsSetArea){
      var newData = []
      this.ipOption.series[0].data.forEach(e => {
        if(checkInArea(e[1],e[0]+1,this.ipStartCol,this.ipEndCol,this.ipStartRow,this.ipEndRow,this.ipSize)){   // col check, need +1
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


  //////////////////////////////////////////////////////////////////////////////
  //    dp chart
  //////////////////////////////////////////////////////////////////////////////

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

  createNewDP():Plate{
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
    const cols = generateCols(this.dpSize);
    const rows = generateRows(this.dpSize);
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
    return newPlate
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

  // general set point type
  setDPPoint(type: number){
    console.log(`dpIsSetArea: ${this.dpIsSetArea}`);
    if(this.dpIsSetArea){
      var newData = []
      this.dpOption.series[0].data.forEach(e => {
        if(checkInArea(e[1],e[0]+1,this.dpStartCol,this.dpEndCol,this.dpStartRow,this.dpEndRow,this.dpSize)){   // col check, need +1
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


  //////////////////////////////////////////////////////////////////////////////
  //    nav
  //////////////////////////////////////////////////////////////////////////////
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

    // clear chart
    if (this.currentStep === 1) {
      this.clearSPChart();
    }
    if (this.currentStep === 2) {
      this.clearCPChart();
    }
    if (this.currentStep === 3) {
      this.clearIPChart();
    }
    if (this.currentStep === 4) {
      this.clearDPChart();
    }

    if (this.currentStep < this.steps.length) {
      this.currentStep++;
    }

    // init chart
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

    // cp chart list
    this.cpChart=null;
    this.cpOption=null;
    this.cpDom=null;
    this.cpList=[];
    this.cpSize=384;
    this.selectedCP=null;
    this.cpCurrentIndex=-1;
    this.cpCurrentPoint=[];
    this.cpIsSetArea=false;
    this.cpStartRow="A";
    this.cpEndRow="P";
    this.cpStartCol=1;
    this.cpEndCol=24;
    
    // ip chart list
    this.ipChart=null;
    this.ipOption=null;
    this.ipDom=null;
    this.ipList=[];
    this.ipSize=384;
    this.selectedIP=null;
    this.ipCurrentIndex=-1;
    this.ipCurrentPoint=[];
    this.ipIsSetArea=false;
    this.ipStartRow="A";
    this.ipEndRow="P";
    this.ipStartCol=1;
    this.ipEndCol=24;


    // dp chart list
    this.dpChart=null;
    this.dpOption=null;
    this.dpDom=null;
    this.dpList=[];
    this.dpSize=384;
    this.selectedDP=null;
    this.dpCurrentIndex=-1;
    this.dpCurrentPoint=[];
    this.dpIsSetArea=false;
    this.dpStartRow="A";
    this.dpEndRow="P";
    this.dpStartCol=1;
    this.dpEndCol=24;


    // table
    this.theoreticalList=[];
    this.actualList=[];
    this.intermediateList=[];
    this.activeTab=0;

    // file
    this.barcodeFileType="";
    this.barcodeFileContent=null;
    this.barcodeMap=new Map<string, string>();
    this.pickListName="";

    this.spFileType="";
    this.spFileContent=null;
  }

  clearSPChart(): void {
    if (this.spChart) {
        this.spChart.dispose();
        this.spChart = null;
    }
  }

  clearCPChart(): void {
    if (this.cpChart) {
        this.cpChart.dispose();
        this.cpChart = null;
    }
  }

  clearIPChart(): void {
    if (this.ipChart) {
        this.ipChart.dispose();
        this.ipChart = null;
    }
  }


  clearDPChart(): void {
    if (this.dpChart) {
        this.dpChart.dispose();
        this.dpChart = null;
    }
  }















  //////////////////////////////////////////////////////////////////////////////
  //    deleteModal  todo...  delete confirm
  //////////////////////////////////////////////////////////////////////////////
  





















  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //    IP Tabs and IP/DP transfer logic
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  setActiveTab(index: number): void {
    this.activeTab = index;
  }

  // generate ip table, [theore, final, inter]list
  generateIPTable(){
    console.log("generateIPTable")
    let MaxInterConcenNum = this.maxInterConcenNum//2                       //this.maxInterConcenNum
    const ConcenTolerance = this.concenTolerance//10                        //this.concenTolerance
    let ReagentVolume = this.reagentVolume*uL//=40*uL
    let DilutionFactor = this.dilutionFactor//3                          //this.dilutionFactor
    let DataPoints = this.dataPoints//8                              //this.dataPoints
    let MinTransVol = this.interMinTransfer*nL      //2.5*nL
    let InterMaxTransfer = this.interMaxTransfer*nL//1000*nL                  //this.interMaxTransfer*nL//1000*nL
    let MaxTransVol = this.destMaxTransfer*nL//40*nL                         //this.destMaxTransfer*nL//197.5*nL
    let MinTransStep = this.interMinTransfer*nL     //2.5*nL

    let SourceConcentration = this.sampleConcentration*getUnit(this.conUnitSample)//10*mM                 //this.sampleConcentration*mM//1*10**1*mM
    let StartConcentration = this.startConcentration*getUnit(this.conUnitStart)                //this.startConcentration*mM//100*uM
    let BulkFillVol = this.bulkFill*uL              //15*uL

    this.solvent = Math.round(MaxTransVol*100/(ReagentVolume+MaxTransVol)*100)/100  //%
    let Solvent = this.solvent/100
    console.log(`Solvent: ${Solvent}`)
    let InterAllFinalConcenLst = []
    let TheorConcenLst = []
    let CurrentConcen = 0
    this.theoreticalList = []

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
      return Number(b.TheoreConcen) - Number(a.TheoreConcen); // Descending order for 'TheoreConcen'
    });

    console.log(this.actualList)

    // Step 2: Remove duplicates based on 'TheoreConcen', keeping the one with the smaller 'TheoreConcen'
    const finalActualList: any[] = [];
    const seen = new Set<number>();

    for (const item of this.actualList) {
      if (!seen.has(Number(item.TheoreConcen))) {
        finalActualList.push(item);
        seen.add(Number(item.TheoreConcen));
      }
    }

    this.actualList = finalActualList;
    console.log(this.actualList)


    // generate layout
    // this.generateIPLayout();
  }

  // reset sample and control to available in IP
  ipSampleControlReset(){
    const cols = generateCols(this.ipSize);
    const rows = generateRows(this.ipSize);
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let c = 0; c < cols.length; c++) {
        const col = cols[c];
        const ipPoint = this.ipList[0].wells.find((x) => x.col === col && x.row === row);
        if (ipPoint&&(ipPoint.type==PointType.Sample||ipPoint.type==PointType.ControlCurve)) {
          ipPoint.type= 3;
          ipPoint.concentration= "";
          ipPoint.name= "";
          const index = this.ipList[0].wells.findIndex((x) => x.col === col && x.row === row);
          this.ipList[0].wells[index] = ipPoint;// todo?? select ip chart
        }
      }
    }
    var data = [];
    this.ipList[0].wells.forEach(well => {
      data.push([well.col-1,well.row,well.type]) // well to data:     col 1==>0
    });
    this.ipOption.series[0].data = data
    this.ipChart.clear();
    this.ipOption.animation=false;
    this.ipChart.setOption(this.ipOption)
  }

  // reset sample and control(with name) to available in DP
  dpSampleControlReset(){
    const cols = generateCols(this.dpSize);
    const rows = generateRows(this.dpSize);

    if (this.dpList.length>0) {
      this.dpList = this.dpList.slice(0, 1);
      this.selectedDP = this.dpList[0]
    }

    for (let p = 0; p < this.dpList.length; p++) {
      const plate = this.dpList[p];
      for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        for (let c = 0; c < cols.length; c++) {
          const col = cols[c];
          const point = plate.wells.find((x) => x.col === col && x.row === row);
          if (point&&(point.type==0||point.type==6)){
            point.type= 3;
            point.concentration= "";
            point.name= "";
            const index = plate.wells.findIndex((x) => x.col === col && x.row === row);
            plate.wells[index] = point;// todo?? select ip chart
          }
        }
      }

      this.dpList[p]=plate;

      var data = [];
      plate.wells.forEach(well => {
        data.push([well.col-1,well.row,well.type]) // well to data:     col 1==>0
      });
      this.dpOption.series[0].data = data
      this.dpChart.clear();
      this.dpOption.animation=false;
      this.dpChart.setOption(this.dpOption)

    }
    
    
  }


  // generate pick list and layout. all in one
  generateIPLayoutAndPickList(){
    // 1. generate ip table
    // reset IP Layout, 0/1 =>3
    this.ipSampleControlReset();
    this.generateIPTable();
    this.ipPickList = []
    //////////////////////////////////////////////////////////////////////////////
    //  sp => ip
    //////////////////////////////////////////////////////////////////////////////
    let sp2ipPickList:Pick[] = []

    let sampleNum = 1
    for (let i = 0; i < this.spList.length; i++) {
      let sourcePlate = this.spList[i];
      if (sourcePlate==null||sourcePlate.wells==null||sourcePlate.wells.length==0) {
        continue;
      }
      // reorder sp wells
      for (let k = 0; k < sourcePlate.wells.length; k++) {
        const sourceWell = sourcePlate.wells[k];
        //get sample well
        if (sourceWell.type==PointType.Sample) {
          // only support one IP
          let destPlate = getAvailablePlateFromList(this.ipList, this.intermediateList.length);
          if(destPlate==null){
            console.log("no enough available well")//todo error
            break;
          }
          console.log(destPlate)
          let [pickList, newDestPlate] = perPointIPLayoutAndPickList(destPlate,sourcePlate,sourceWell, sampleNum,this.intermediateList,"Sample",this.sampleDirection,this.curveDirection)
          // update new dest plate to this.xxxList
          let destIndex = this.ipList.findIndex(x=>x.name==newDestPlate.name)
          this.ipList[destIndex] = newDestPlate
          // push pick list
          sp2ipPickList.push(...pickList);
          sampleNum = sampleNum+1
        }
      }
    }
    this._updateIPChart()

    console.log("this.ipList")
    console.log(this.ipList)
    console.log("sp2ipPickList")
    console.log(sp2ipPickList)
    

    //////////////////////////////////////////////////////////////////////////////
    //  cp => ip
    //////////////////////////////////////////////////////////////////////////////
    let cp2ipPickList:Pick[] = []

    let controlNum = 1
    for (let i = 0; i < this.cpList.length; i++) {
      let sourcePlate = this.cpList[i];
      if (sourcePlate==null||sourcePlate.wells==null||sourcePlate.wells.length==0) {
        continue;
      }
      // reorder sp wells
      for (let k = 0; k < sourcePlate.wells.length; k++) {
        const sourceWell = sourcePlate.wells[k];
        //get control well
        if (sourceWell.type==PointType.Control) {
          // only support one IP
          let destPlate = getAvailablePlateFromList(this.ipList, this.intermediateList.length);
          if(destPlate==null){
            console.log("no enough available well")//todo error
            break;
          }
          console.log(destPlate)
          let [pickList, newDestPlate] = perPointIPLayoutAndPickList(destPlate,sourcePlate,sourceWell, controlNum,this.intermediateList,"Control",this.sampleDirection,this.curveDirection)
          // update new dest plate to this.xxxList
          let destIndex = this.ipList.findIndex(x=>x.name==newDestPlate.name)
          this.ipList[destIndex] = newDestPlate
          // push pick list
          cp2ipPickList.push(...pickList);
          controlNum = controlNum + 1
        }
      }
    }
    this._updateIPChart()

    console.log("this.ipList")
    console.log(this.ipList)
    console.log("cp2ipPickList")
    console.log(cp2ipPickList)


    this.ipPickList.push(...sp2ipPickList)
    this.ipPickList.push(...cp2ipPickList)
    console.log("this.ipPickList")
    console.log(this.ipPickList)
  }


  // generate dp pick list and dp layout with [actual list]
  generateDPLayoutAndPickList(){
    // 1. generate ip table
    // reset contol(with concentration/name), sample
    this.dpSampleControlReset();

    this.dpPickList = []

    ////////////////////////////////////////
    //  sp/ip => dp  (Sample/control curve)
    ////////////////////////////////////////
    let samplePickList:Pick[] = []
    let controlPickList:Pick[] = []
    let sampleNum = 1

    let firstPlate = true;
    //let useDpNameList = []

    for (let i = 0; i < this.spList.length; i++) {
      let sourcePlate = this.spList[i];
      if (sourcePlate==null||sourcePlate.wells==null||sourcePlate.wells.length==0) {
        continue;
      }
      for (let k = 0; k < sourcePlate.wells.length; k++) {
        const sourceWell = sourcePlate.wells[k];
        //get sample well
        if (sourceWell.type==PointType.Sample) {

          // add control curve in dp_1, dp_1 should 
          if(firstPlate){
            console.log("first dp add control curve..")
            let cpl= this._addPerPlateControlCurve(this.dpList[0])
            controlPickList.push(...cpl)
          }

          let destPlate = getAvailablePlateFromList(this.dpList, this.actualList.length*this.curveReplicates);

          // new dp plate, and no exist dp, create
          if(destPlate==null){
            console.log("no enough available well")
            //create dp list, copy dp[0]
            this._createAvailableDPFromTemplate();
            destPlate = getAvailablePlateFromList(this.dpList, this.actualList.length*this.curveReplicates);
            // add control curve per new dp
            let cpl  = this._addPerPlateControlCurve(destPlate)
            controlPickList.push(...cpl)
          }

          let [pickList, newDestPlate] = samplePointDPLayoutAndPickList(destPlate, sourcePlate, sourceWell, this.ipList[0], sampleNum, this.actualList, "Sample", this.sampleDirection, this.curveDirection, this.sampleConcentration, this.curveReplicates)
          //update new dest plate to this.xxxList
          let destIndex = this.dpList.findIndex(x=>x.name==newDestPlate.name)
          this.dpList[destIndex] = newDestPlate
          // push pick list
          samplePickList.push(...pickList);

          // logic used
          sampleNum = sampleNum + 1
          firstPlate = false;
          
        }
      }
      this._updateDPChart()

      console.log("this.dpList")
      console.log(this.dpList)
      console.log("samplePickList")
      console.log(samplePickList)
      console.log("controlPickList")
      console.log(controlPickList)
    
    }


    ////////////////////////////////////////
    //  cp => dp  (Control)
    ////////////////////////////////////////
    //let controlPickList:Pick[] = []
    if(this.cpList.length>0||this.cpList[0].wells.length>0){
      //get control well
      const controlWell = this.cpList[0].wells[0];
      for (let p = 0; p < this.dpList.length; p++) {
        const destPlate = this.dpList[p];
        let [pickList, _] = rawControlPointDPLayoutAndPickList(destPlate,this.cpList[0],controlWell,this.destMaxTransfer)
        controlPickList.push(...pickList);
      
      }
      console.log("add raw control, controlPickList")
      console.log(controlPickList)
    }
    

    ////////////////////////////////////////
    //  ip => dp  (back fill)
    ////////////////////////////////////////
    let backfillPickList:Pick[] = []

    //get all sample/control_curve point
    for (let p = 0; p < this.dpList.length; p++) {
      const dp = this.dpList[p];
      dp.wells.forEach(well => {
        if (well.type==PointType.Sample||well.type==PointType.ControlCurve) {
          let pick:Pick={
            spName:"",
            spRow:"",
            spCol:0,
            dpName:dp.name,
            dpRow:well.row,
            dpCol:well.col,
    
            vol: this.destMaxTransfer-well.volume,
          }
          if (pick.vol>0) {
            backfillPickList.push(pick)
          }
        }
      });
    }
    // all bulk fill point
    let bulkFillWell = []
    this.ipList[0].wells.forEach(well=>{
      if(well.type==PointType.Bulkfill){
        bulkFillWell.push(well)
      }
    })
    // combine bulk fill source point
    for (let i = 0; i < backfillPickList.length; i++) {
        const sWell = bulkFillWell[i % bulkFillWell.length];
        backfillPickList[i].spName = this.ipList[0].name;
        backfillPickList[i].spRow = sWell.row;
        backfillPickList[i].spCol = sWell.col;
    }
    console.log("backfillPickList")
    console.log(backfillPickList)


    ////////////////////////////////////////
    //  ip => dp  (solvent)
    ////////////////////////////////////////
    let solventPickList:Pick[] = []

    //get all sample/control_curve point
    for (let p = 0; p < this.dpList.length; p++) {
      const dp = this.dpList[p];
      dp.wells.forEach(well => {
        if (well.type==PointType.Solvent) {
          let pick:Pick={
            spName:"",
            spRow:"",
            spCol:0,
            dpName:dp.name,
            dpRow:well.row,
            dpCol:well.col,
            vol: this.destMaxTransfer,
          }
          if (pick.vol>0) {
            solventPickList.push(pick)
          }
        }
      });
    }

    // combine bulk fill source point
    for (let i = 0; i < solventPickList.length; i++) {
        const sWell = bulkFillWell[i % bulkFillWell.length];
        solventPickList[i].spName = this.ipList[0].name;
        solventPickList[i].spRow = sWell.row;
        solventPickList[i].spCol = sWell.col;
    }
    console.log("solventPickList")
    console.log(solventPickList)



    // append to picklist
    this.dpPickList.push(...samplePickList)
    this.dpPickList.push(...controlPickList)
    this.dpPickList.push(...backfillPickList)
    this.dpPickList.push(...solventPickList)
    console.log("this.dpPickList")
    console.log(this.dpPickList)

    // all picklist
    this.allPickList = []
    this.allPickList.push(...this.ipPickList)
    this.allPickList.push(...this.dpPickList)
    console.log("this.allPickList")
    console.log(this.allPickList)
  }


  // update the IP chart with this.iplist
  _updateIPChart(){
    var data = [];
    this.ipList[0].wells.forEach(well => {
      data.push([well.col-1,well.row,well.type]) // well to data:     col 1==>0
    });
    this.ipOption.series[0].data = data
    this.ipChart.clear();
    this.ipOption.animation=false;
    this.ipChart.setOption(this.ipOption)
  }

  // update the DP chart with this.dplist
  _updateDPChart(){
    var data = [];
    let dp = this.dpList.find(x=>x.name==this.selectedDP.name)
    dp.wells.forEach(well => {
      data.push([well.col-1,well.row,well.type]) // well to data:     col 1==>0
    });
    this.dpOption.series[0].data = data
    this.dpChart.clear();
    this.dpOption.animation=false;
    this.dpChart.setOption(this.dpOption)
  }

  // update the SP chart with this.dplist
  _updateSPChart(){
    var data = [];
    let sp = this.spList.find(x=>x.name==this.selectedSP.name)
    sp.wells.forEach(well => {
      data.push([well.col-1,well.row,well.type]) // well to data:     col 1==>0
    });
    this.spOption.series[0].data = data
    this.spChart.clear();
    this.spOption.animation=false;
    this.spChart.setOption(this.spOption)
  }

  // create new plate by template
  _createAvailableDPFromTemplate(){
    //copy plate[0]
    let plate0 = this.dpList[0]
    let newPlate = JSON.parse(JSON.stringify(plate0));

    if(this.dpList.length>0){
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

      let newWells:Well[]=[]
      plate0.wells.forEach(w => {
        if(w.type==0||w.type==6){
          let newWell:Well={
            col:w.col,
            row:w.row,
            type:3
          }
          newWells.push(newWell)
        }else{
          newWells.push(w)
        }
      });
      newPlate.name=newName
      newPlate.wells=newWells
      newPlate.barcode=""
      this.dpList.push(newPlate);
    }else{
      newPlate = this.createNewDP();
    }
  }

  // ip => dp  (Control), only one control point
  _addPerPlateControlCurve(destPlate:Plate):Pick[]{
    let controlPickList:Pick[] = []
    
    if(this.perPlateControlCurve==true){
      console.log(" Add control above plate.......")
      let cp = this.cpList[0]
      if (cp==null||cp.wells==null||cp.wells.length==0) {
        console.log("no control point")
      }else{
        let cWell = cp.wells[0]
        let [pickList, newDestPlate] = controlPointDPLayoutAndPickList(destPlate, cp, cWell, this.ipList[0], this.actualList, this.sampleDirection, this.curveDirection, this.sampleConcentration, this.curveReplicates)
        //update new dest plate to this.xxxList
        let destIndex = this.dpList.findIndex(x=>x.name==newDestPlate.name)
        this.dpList[destIndex] = newDestPlate
        this._updateDPChart()
        // push pick list
        controlPickList.push(...pickList);
        
      }
    }
    return controlPickList
  }




  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //    import/export logic
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  onBarcodeFileSelected(event) {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        this.barcodeFileType = "Excel";
      }else if(file.name.endsWith('.csv') ){
        this.barcodeFileType = "Csv";
      }else{
        return; //error
      }
      this.barcodeFileContent = e.target.result;
    };
    reader.readAsBinaryString(file);    
  }

  importBarcodeMap() {
    //this.parser.handle_Sample_Plate(this.fileContent_9, this.fileType_9);
    let data = parseFile(this.barcodeFileContent, this.barcodeFileType);
    console.log(data)
    this.barcodeMap.clear();
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      if (!isNullOrEmpty(d.SP)) {
        this.barcodeMap[`SP_${i+1}`]=d.SP
      }
      if (!isNullOrEmpty(d.CP)) {
        this.barcodeMap[`CP_${i+1}`]=d.CP
      }
      if (!isNullOrEmpty(d.IP)) {
        this.barcodeMap[`IP_${i+1}`]=d.IP
      }
      if (!isNullOrEmpty(d.DP)) {
        this.barcodeMap[`DP_${i+1}`]=d.DP
      }
    }

    for (const key in this.barcodeMap) {
      console.log(`${key}: ${this.barcodeMap[key]}`);
    }

  }


  setPickListBarcode(){
    console.log("this.allPickList")
    console.log(this.allPickList)

    let newPickList = []
    for (let i = 0; i < this.allPickList.length; i++) {
      let pick = this.allPickList[i];
      if (pick.spName in this.barcodeMap) {
        pick.spName = this.barcodeMap[pick.spName]
      }
      if (pick.dpName in this.barcodeMap) {
        pick.dpName = this.barcodeMap[pick.dpName]
      }
      newPickList.push(pick)
    }
    this.allPickList = newPickList
    console.log("after set barcode this.allPickList")
    console.log(this.allPickList)

  }


  exportPickList(){
    // set real barcode
    this.setPickListBarcode()

    const csvString = objectsToCSV(this.allPickList);

    // creare blob
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    // create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    if (isNullOrEmpty(this.pickListName)) {
      link.download = "default.csv";
    }
    link.download = this.pickListName + ".csv";
    link.click();

    // release
    URL.revokeObjectURL(url);

  }




}






























////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateCols(size:number):number[]{
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

function generateRows(size:number):string[]{
  var rows = [];
  if (size==96) {
    rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  }else if(size==384){
    rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']
  }else if(size==1536){
    rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF']
  }else{
      console.log("size error: "+ size)
      return null;
  }
  return rows;
}


// check if point in area
function checkInArea(row:string, col:number,st_col:number,ed_col:number,st_row:string,ed_row:string,plateSize:number):boolean{
  const cols = generateCols(plateSize);
  const rows = generateRows(plateSize);

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


function getUnit(unit:string):number{
  if (unit=="M") {return M}
  if (unit=="mM") {return mM}
  if (unit=="uM") {return uM}
  if (unit=="nM") {return nM}
  if (unit=="pM") {return nM}
  if (unit=="fM") {return nM}
  if (unit=="aM") {return nM}
  return mM;
}


function getAvailablePlateFromList(plateList:Plate[], dataPoints:number):Plate{
  for (let i = 0; i < plateList.length; i++) {
    const plate = plateList[i];

    if(plate.wells==null||plate.wells.length==0){
      continue;
    }

    let availWells = plate.wells.filter(well => well.type === PointType.Available);
    if (availWells.length>=dataPoints) {
      return plate;
    }
  }
  return null;
}



// get first available well of plate
function getFirstAvailableWell(sampleDirect:string, plate:Plate):Well{
  let well:Well;
  //push all wells to list, order them
  let size = plate.wells.length
  let rowOrderList = generateRows(size)
  let colOrderList = generateCols(size)
  if (sampleDirect=="Across") {
    // order wells
    plate.wells.sort((a, b) => {
      // first order by row
      const rowAIndex = rowOrderList.indexOf(a.row);
      const rowBIndex = rowOrderList.indexOf(b.row);
      if (rowAIndex !== rowBIndex) {
        return rowAIndex - rowBIndex;
      }
      // if row equal, then order by col
      const colAIndex = colOrderList.indexOf(a.col);
      const colBIndex = colOrderList.indexOf(b.col);
      return colAIndex - colBIndex;
    });
  }else{//down
    // order wells
    plate.wells.sort((a, b) => {
      // first order by col
      const colAIndex = colOrderList.indexOf(a.col);
      const colBIndex = colOrderList.indexOf(b.col);
      if (colAIndex !== colBIndex) {
        return colAIndex - colBIndex;
      }
      // if col equal, then order by row
      const rowAIndex = rowOrderList.indexOf(a.row);
      const rowBIndex = rowOrderList.indexOf(b.row);
      return rowAIndex - rowBIndex;
    });
  }
  let avaList = plate.wells.filter(x=>x.type==PointType.Available)
  well = avaList[0];
  return well;
}


// get next available well list of plate
function getNextAvailableWellList(firstWell:Well, curveDirect:string, plate:Plate, listNum:number):Well[]{
  let wellList = []

  //push all wells to list, order them
  let size = plate.wells.length
  let rowOrderList = generateRows(size)
  let colOrderList = generateCols(size)

  if (curveDirect=="Across"){
    // order wells
    plate.wells.sort((a, b) => {
      // first order by row
      const rowAIndex = rowOrderList.indexOf(a.row);
      const rowBIndex = rowOrderList.indexOf(b.row);
      if (rowAIndex !== rowBIndex) {
        return rowAIndex - rowBIndex;
      }
      // if row equal, then order by col
      const colAIndex = colOrderList.indexOf(a.col);
      const colBIndex = colOrderList.indexOf(b.col);
      return colAIndex - colBIndex;
    });

  }else{ //down
    // order wells
    plate.wells.sort((a, b) => {
      // first order by col
      const colAIndex = colOrderList.indexOf(a.col);
      const colBIndex = colOrderList.indexOf(b.col);
      if (colAIndex !== colBIndex) {
        return colAIndex - colBIndex;
      }
      // if col equal, then order by row
      const rowAIndex = rowOrderList.indexOf(a.row);
      const rowBIndex = rowOrderList.indexOf(b.row);
      return rowAIndex - rowBIndex;
    });
  }
  //get first well index
  let avaList = plate.wells.filter(x=>x.type==PointType.Available)
  let firstIndex = avaList.findIndex(x=>x.row==firstWell.row&&x.col==firstWell.col)
  wellList = avaList.slice(firstIndex, listNum+firstIndex);
  return wellList
}


function perPointIPLayoutAndPickList(destPlate:Plate, sourcePlate:Plate, sourceWell:Well, sampleNum:number, interPointList:IntermediateEntity[], pointName:string,
  sampleDirection:string,curveDirection:string)
:[Pick[],Plate]
{
  // foreach sample point
  //let sampleNum = 1
  let pickList:Pick[]=[]

  let firstWell = getFirstAvailableWell(sampleDirection, destPlate);

  // get available well list
  let availWellList = getNextAvailableWellList(firstWell, curveDirection, destPlate, interPointList.length)

  //console.log("availWellList")
  //console.log(availWellList)

  // change well to inter well, and push [inter] volume
  
  for (let n = 0; n < interPointList.length; n++) {
    const interEntity = interPointList[n];
    let pick:Pick={
      spName:sourcePlate.name,
      spRow:sourceWell.row,
      spCol:sourceWell.col,

      dpName:destPlate.name,
      dpRow:availWellList[n].row,
      dpCol:availWellList[n].col,

      vol: interEntity.TransVolResult,
    }
    pickList.push(pick)

    availWellList[n].concentration= interEntity.FinalConcen
    if (pointName=="Sample") {availWellList[n].type=PointType.Sample}
    if (pointName=="Control") {availWellList[n].type=PointType.ControlCurve}
    availWellList[n].name=`${pointName}_${sampleNum}`
  }

  // update dest well list
  availWellList.forEach(ava => {
    let indexAva = destPlate.wells.findIndex(w=>w.row==ava.row&&w.col==ava.col)
    destPlate.wells[indexAva] = ava 
  });

  return [pickList, destPlate]
}

// sp/ip to dp, sample point
function samplePointDPLayoutAndPickList(destPlate:Plate, sourcePlate:Plate, sourceWell:Well, interPlate:Plate, sampleNum:number, actualPointList:ActualEntity[], pointName:string,
  sampleDirection:string,curveDirection:string,sampleCon:number, curveReplicates:number)
:[Pick[],Plate]
{
  // foreach sample point
  //let sampleNum = 1
  let pickList:Pick[]=[]

  let firstWell = getFirstAvailableWell(sampleDirection, destPlate);

  // get available well list
  let availWellList = getNextAvailableWellList(firstWell, curveDirection, destPlate, actualPointList.length*curveReplicates)

  //console.log("availWellList")
  //console.log(availWellList)

  // change well to inter well, and push [inter] volume
  for (let c = 0; c < curveReplicates; c++) {
    for (let n = 0; n < actualPointList.length; n++) {
      let index = n+c*actualPointList.length
        const actualEntity = actualPointList[n];

      // find point with name and concentration
      let pick:Pick={
        spName:"",
        spRow:"",
        spCol:0,
        dpName:destPlate.name,
        dpRow:availWellList[index].row,
        dpCol:availWellList[index].col,

        vol: actualEntity.TransVolResult,
      }
      if (Number(actualEntity.SourceConcen)==sampleCon) {
        pick.spName = sourcePlate.name
        pick.spRow = sourceWell.row
        pick.spCol = sourceWell.col
      }else{
        let srWell = interPlate.wells.find(x=>x.name==`${pointName}_${sampleNum}`&&x.concentration==actualEntity.SourceConcen)
        pick.spName = interPlate.name
        pick.spRow = srWell.row
        pick.spCol = srWell.col
      }

      
      pickList.push(pick)

      availWellList[index].concentration = actualEntity.RealConcen
      availWellList[index].volume = actualEntity.TransVolResult 
      if (pointName=="Sample") {availWellList[index].type=PointType.Sample}
      // if (pointName=="Control") {availWellList[n].type=1}
      availWellList[index].name =`${pointName}_${sampleNum}`
    }
  }

  // update dest well list
  availWellList.forEach(ava => {
    let indexAva = destPlate.wells.findIndex(w=>w.row==ava.row&&w.col==ava.col)
    destPlate.wells[indexAva] = ava 
  });

  return [pickList, destPlate]
}


// sp/ip to dp, control point
function controlPointDPLayoutAndPickList(destPlate:Plate, controlPlate:Plate, controlWell:Well, interPlate:Plate, actualPointList:ActualEntity[]
  ,sampleDirection:string, curveDirection:string, sampleCon:number, curveReplicates:number)
:[Pick[],Plate]
{
  // foreach sample point
  //let sampleNum = 1
  let pickList:Pick[]=[]

  let firstWell = getFirstAvailableWell(sampleDirection, destPlate);

  // get available well list
  let availWellList = getNextAvailableWellList(firstWell, curveDirection, destPlate, actualPointList.length*curveReplicates)

  //console.log("availWellList")
  //console.log(availWellList)

  // change well to inter well, and push [inter] volume
  for (let c = 0; c < curveReplicates; c++) {
    for (let n = 0; n < actualPointList.length; n++) {
      let index = n+c*actualPointList.length
      const actualEntity = actualPointList[n];
      // find point with name and concentration
      let pick:Pick={
        spName:"",
        spRow:"",
        spCol:0,
        dpName:destPlate.name,
        dpRow:availWellList[index].row,
        dpCol:availWellList[index].col,
  
        vol: actualEntity.TransVolResult,
      }
      if (Number(actualEntity.SourceConcen)==sampleCon) {
        pick.spName = controlPlate.name
        pick.spRow = controlWell.row
        pick.spCol = controlWell.col
      }else{
        let srWell = interPlate.wells.find(x=>x.name==`Control_1`&&x.concentration==actualEntity.SourceConcen)
        pick.spName = interPlate.name
        pick.spRow = srWell.row
        pick.spCol = srWell.col
      }
      
      pickList.push(pick)
  
      availWellList[index].concentration= actualEntity.RealConcen
      availWellList[index].type=PointType.ControlCurve
      availWellList[index].volume = actualEntity.TransVolResult 
      availWellList[index].name=`Control_1`
    }
  }
  

  // update dest well list
  availWellList.forEach(ava => {
    let indexAva = destPlate.wells.findIndex(w=>w.row==ava.row&&w.col==ava.col)
    destPlate.wells[indexAva] = ava 
  });

  return [pickList, destPlate]
}



// raw cp to dp
function rawControlPointDPLayoutAndPickList(destPlate:Plate, controlPlate:Plate, controlWell:Well, pointTransVol:number)
:[Pick[],Plate]
{
  // foreach sample point
  //let sampleNum = 1
  let pickList:Pick[]=[]

  for (let w = 0; w < destPlate.wells.length; w++) {
    const destWell = destPlate.wells[w];
    
    if (destWell.type==PointType.Control) {
      let pick:Pick={
        spName:controlPlate.name,
        spRow:controlWell.row,
        spCol:controlWell.col,
        dpName:destPlate.name,
        dpRow:destWell.row,
        dpCol:destWell.col,
        vol: pointTransVol,
      }
      pickList.push(pick)
    }
  }

  return [pickList, destPlate]
}




// parse filee
function parseFile(fileContent:any, fileType:string, sheetNum:number=0, hasHeader=true):any[]{
  if(fileType=="Excel"){
    return parseExcelFile(fileContent,sheetNum);
  }else if(fileType=="Csv"){
    return parseCsvFile(fileContent,hasHeader);
  }
}

function parseExcelFile(fileContent: any, sheet: number): any[] {
  const workbook = XLSX.read(fileContent, { type: 'binary' });
  const sheetName = workbook.SheetNames[sheet];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet, { raw: true });
}

function parseCsvFile(fileContent: any, hasHeader: boolean = true): any[] {
  const result = Papa.parse(fileContent, {
    header: hasHeader,
    skipEmptyLines: true
  });
  return result.data;
}



function objectsToCSV(data: Pick[]): string {
    if (data.length === 0) return '';

    let csvString = '';
    data.forEach(item => {
      const row = [
        item.spName,
        `${item.spRow}${item.spCol}`,
        item.dpName,
        item.vol,
        `${item.dpRow}${item.dpCol}`,
      ].join(',') + '\n';
      csvString += row;
    });

    return csvString;
  }






















////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Dilution algorithm
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



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
):[number[],ActualEntity[]]{
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
          let actualEntity:ActualEntity={
            SourceConcen:SourceConcen.toExponential(3),
            TransVolResult:TransVolResult,
            BackfillVol:BackfillVol,
            TheoreConcen:TheoreConcen.toExponential(3),
            RealConcen:RealConcen.toExponential(3),
            ErrorConcen:Math.round(ErrorConcen*1e2)/1e2,
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
):[number[],IntermediateEntity]{
  let result: IntermediateEntity;
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





















////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    interface
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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

  destinationCopies: number; //Number of Destination Copies

  sampleConcentration: number; // Sample Concentration
  conUnitSample:string;
  startConcentration: number; //Starting Concentration
  conUnitStart:string;

  dilutionFactor: number; //Dilution Factor
  dataPoints: number; //Data Points

  sampleDirection:string; // Sample Direction
  curveDirection:string; // Curve Direction

  curveReplicates:number; //Number of Curve Replicates
  perPlateControlCurve:boolean; //Control Curve Per Plate
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
  name?: string;
  concentration?: string;
  volume?: number;
}


interface Pick {
  spName:string;
  spRow:string;
  spCol:number;

  dpName:string;
  dpRow:string;
  dpCol:number;

  vol:number;
}


interface ActualEntity{
  SourceConcen:string;
  TransVolResult:number;
  BackfillVol:number;
  TheoreConcen:string;
  RealConcen:string;
  ErrorConcen:number;
  Comment:string;
}


interface IntermediateEntity{
  SourceConcen:number;
  TransVolResult:number;
  FinalConcen:string;
  BulkfillVol:number;
}


enum PointType {
  Sample, // 0
  Control, // 1
  Reserved, // 2
  Available, // 3
  Solvent, //4
  Bulkfill, //5
  ControlCurve, //6

}




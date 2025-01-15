import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import { OpCompoundLibraryService } from '@proxy/open-app-service';
import { List, number } from 'echarts';
import { ImportLiquidPlateDto, ImportPlateCopyDto, ImportResultFileDto, InstrumentDto, PlateChildDto, PlateDto, LiquidTransferHistoryDto, CsvHeaderDto, ReportDto, ReportItemDto  } from '@proxy/dtos';
import { waitForAsync } from '@angular/core/testing';
import { EventService } from './event-service';
import { Nucleobase, TransferType } from '@proxy/enum';
import { CsvHeaderService } from '@proxy/app-services';
import { distinct, lastValueFrom, map } from 'rxjs';
import { IfStmt } from '@angular/compiler';
// import { type } from 'os';

export class Parser {
  constructor(private opCompoundLibraryService: OpCompoundLibraryService,
    private csvHeaderService: CsvHeaderService,
    private eventService: EventService
  ) {}


  // 1.
  async handle_Compound_Library_SmartTM(fileContent: any, fileType:string):Promise<void> {
    console.log("start handleCompoundLibrary_SmartTM..."+fileType);
    let compoundLst: ImportLiquidPlateDto[] = new Array<ImportLiquidPlateDto>();
    let map = await this.getCsvHeaderMap("Compound Library SmartTM");

    if (fileContent==null){
      this.eventService.myEvent1.emit('{"ErrorCode":1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }

    let data = this.parseFile(fileContent,fileType, 1);
    if(data.length==0){
      this.eventService.myEvent1.emit('{"ErrorCode":-1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }

    let error = this.checkHeader(data[0], map);
    if (error!=null){
      this.eventService.myEvent1.emit(`{"ErrorCode":-1,"ErrorMessage":"${error}","EntityDto":null}`);
      return;
    }

    console.log(data);
    let len = 80;
    if (data.length<80){
      len=data.length;
    }
    for (let index = 0; index < data.length; index++) {
      const dataRow = data[index];
      let entity: ImportLiquidPlateDto =
      {
        plateName: dataRow[map["PlateName"]],
        row: dataRow[map["Row"]],
        column: parseInt(dataRow[map["Column"]]),
        name: dataRow[map["CompoundName"]],
        volume: parseFloat(dataRow[map["Volume"]]),
        concentration: parseFloat(dataRow[map["Concentration"]]),
        smiles: dataRow[map["SMILES"]],
        primerList: null
      }
      compoundLst.push(entity);
    }
    console.log(compoundLst);
    this.opCompoundLibraryService.importCompoundLibraryByLiquidPlateLst(compoundLst).subscribe((data) => {
      console.log(data);
      this.eventService.myEvent1.emit(data);
    });
  }

  //1.1
  async handle_Compound_Plate(fileContent: any, fileType:string): Promise<void> {
    console.log("start handle_Compound_Plate..."+fileType);
    let liquidPlateLst: ImportLiquidPlateDto[] = new Array<ImportLiquidPlateDto>();
    let map = await this.getCsvHeaderMap("Compound Plate");

    if (fileContent==null){
      this.eventService.myEvent1_1.emit('{"ErrorCode":1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }

    let data = this.parseFile(fileContent, fileType);
    if(data.length==0){
      this.eventService.myEvent1_1.emit('{"ErrorCode":-1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }
    
    let error = this.checkHeader(data[0], map);
    if (error!=null){
      this.eventService.myEvent1_1.emit(`{"ErrorCode":-1,"ErrorMessage":"${error}","EntityDto":null}`);
      return;
    }

    for (let index = 0; index < data.length; index++) {
      const dataRow = data[index];
      let entity: ImportLiquidPlateDto =
      {
        plateName: dataRow[map["PlateName"]],
        plateType: dataRow[map["PlateType"]],
        row: dataRow[map["Row"]],
        column: parseInt(dataRow[map["Column"]]),
        name: dataRow[map["CompoundName"]],
        volume: parseFloat(dataRow[map["Volume(ul)"]]),
        concentration: parseFloat(dataRow[map["Concentration(mM)"]]),
        primerList: null
      }
      liquidPlateLst.push(entity);
    }
    console.log(liquidPlateLst);
    this.opCompoundLibraryService.importCompoundLibraryByLiquidPlateLst(liquidPlateLst).subscribe((data) => {
      console.log(data);
      this.eventService.myEvent1_1.emit(data);
    });
  }

  // 2.
  async handle_Cell_Plate(fileContent: any, fileType:string): Promise<void> {
    console.log("start handle_Cell_Plate..."+fileType);
    let liquidPlateLst: ImportLiquidPlateDto[] = new Array<ImportLiquidPlateDto>();
    let map = await this.getCsvHeaderMap("Cell Plate");

    if (fileContent==null){
      this.eventService.myEvent2.emit('{"ErrorCode":1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }

    let data = this.parseFile(fileContent, fileType);
    if(data.length==0){
      this.eventService.myEvent2.emit('{"ErrorCode":-1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }
    
    let error = this.checkHeader(data[0], map);
    if (error!=null){
      this.eventService.myEvent2.emit(`{"ErrorCode":-1,"ErrorMessage":"${error}","EntityDto":null}`);
      return;
    }

    for (let index = 0; index < data.length; index++) {
      const dataRow = data[index];
      let entity: ImportLiquidPlateDto =
      {
        plateName: dataRow[map["PlateName"]],
        plateType: dataRow[map["PlateType"]],
        row: dataRow[map["Row"]],
        column: parseInt(dataRow[map["Column"]]),
        name: dataRow[map["CellName"]],
        volume: parseFloat(dataRow[map["Volume(ul)"]]),
        primerList: null,
      }
      liquidPlateLst.push(entity);
    }
    console.log(liquidPlateLst);
    this.opCompoundLibraryService.importCellPlateByLiquidPlateLst(liquidPlateLst).subscribe((data) => {
      console.log(data);
      this.eventService.myEvent2.emit(data);
    });
  }

  // 3.
  async handle_DMSO_Plate(fileContent: any, fileType:string): Promise<void> {
    console.log("start handle_DMSO_Plate..."+fileType);
    let liquidPlateLst: ImportLiquidPlateDto[] = new Array<ImportLiquidPlateDto>();
    let map = await this.getCsvHeaderMap("DMSO Plate");

    if (fileContent==null){
      this.eventService.myEvent3.emit('{"ErrorCode":1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }

    let data = this.parseFile(fileContent, fileType);
    if(data.length==0){
      this.eventService.myEvent3.emit('{"ErrorCode":-1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }

    let error = this.checkHeader(data[0], map);
    if (error!=null){
      this.eventService.myEvent3.emit(`{"ErrorCode":-1,"ErrorMessage":"${error}","EntityDto":null}`);
      return;
    }

    for (let index = 0; index < data.length; index++) {
      const dataRow = data[index];
      let entity: ImportLiquidPlateDto =
      {
        plateName: dataRow[map["PlateName"]],
        plateType: dataRow[map["PlateType"]],
        row: dataRow[map["Row"]],
        name: "DMSO",
        column: parseInt(dataRow[map["Column"]]),
        volume: parseFloat(dataRow[map["Volume(ul)"]]),
        primerList: null
      }
      liquidPlateLst.push(entity);
    }
    console.log(liquidPlateLst);
    this.opCompoundLibraryService.importDMSOPlateByLiquidPlateLst(liquidPlateLst).subscribe((data) => {
      console.log(data);
      this.eventService.myEvent3.emit(data);
    });
  }

  

  // 4.
  async handle_Plate_Copy(fileContent: any, fileType:string): Promise<void> {
    console.log("start handle_Plate_Copy..."+fileType);
    let liquidPlateLst: ImportPlateCopyDto[] = new Array<ImportPlateCopyDto>();
    let map = await this.getCsvHeaderMap("Plate Copy");

    if (fileContent==null){
      this.eventService.myEvent4.emit('{"ErrorCode":1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }

    let data = this.parseFile(fileContent, fileType);
    if(data.length==0){
      this.eventService.myEvent4.emit('{"ErrorCode":-1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }

    let error = this.checkHeader(data[0], map);
    if (error!=null){
      this.eventService.myEvent4.emit(`{"ErrorCode":-1,"ErrorMessage":"${error}","EntityDto":null}`);
      return;
    }

    for (let index = 0; index < data.length; index++) {
      const dataRow = data[index];
      let entity: ImportPlateCopyDto =
      {
        sourcePlateName: dataRow[map["SourcePlate"]],
        destPlateName: dataRow[map["DestPlate"]],
      }
      liquidPlateLst.push(entity);
    }
    console.log(liquidPlateLst);
    this.opCompoundLibraryService.importPlateCopyByPltLst(liquidPlateLst).subscribe((data) => {
      console.log(data);
      this.eventService.myEvent4.emit(data);
    });
  }

  
  // 5.
  async handle_Cherry_Pick(fileContent: any, fileType:string): Promise<void> {
    console.log("start handle_Cherry_Pick..."+fileType);
    let pickLst: LiquidTransferHistoryDto[] = new Array<LiquidTransferHistoryDto>();
    let map = await this.getCsvHeaderMap("Pick List");

    if (fileContent==null){
      this.eventService.myEvent5.emit('{"ErrorCode":1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }

    let data = this.parseFile(fileContent, fileType);
    if(data.length==0){
      this.eventService.myEvent5.emit('{"ErrorCode":-1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }
    
    let error = this.checkHeader(data[0], map);
    if (error!=null){
      this.eventService.myEvent5.emit(`{"ErrorCode":-1,"ErrorMessage":"${error}","EntityDto":null}`);
      return;
    }

    for (let index = 0; index < data.length; index++) {
      const dataRow = data[index];

      let instument:InstrumentDto = {name:"VirtualInstrument"};
      let sourP:PlateDto = {
        name: dataRow[map["SourcePlateName"]], plateSize: 0,
        plateChildrenList: []
      };
      let sourPC: PlateChildDto = {
        plateFk: sourP,
        column: parseInt(dataRow[map["SourcePlateColumn"]]),
        row: dataRow[map["SourcePlateRow"]]
      }
      let destP:PlateDto = {
        name: dataRow[map["DestPlateName"]], plateSize: 0,
        plateChildrenList: []
      };
      let destPC: PlateChildDto = {
        plateFk: destP,
        column: parseInt(dataRow[map["DestPlateColumn"]]),
        row: dataRow[map["DestPlateRow"]]
      };
      
      let entity: LiquidTransferHistoryDto =
      {
        sourcePlateChildFk: sourPC,
        destinationPlateChildFk: destPC,
        transferVolume: parseFloat(dataRow[map["Volume"]]),
        instrumentFk: instument,
        transferType: TransferType.Mix,
        sourceLiquidFk: undefined,
        destinationLiquidFk: undefined,
        finalLiquidFk: undefined
      }
      pickLst.push(entity);
    }
    console.log(pickLst);
    this.opCompoundLibraryService.importCompoundCellMixByPickLst(pickLst).subscribe((data) => {
      console.log(data);
      this.eventService.myEvent5.emit(data);
    });
  }

  // 6
  async handle_Envision_Result(fileContent: any, fileType:string): Promise<void> {
    console.log("start handle_Envision_Result..."+fileType);
    let resultFileLst: ImportResultFileDto[] = new Array<ImportResultFileDto>();
    let map = await this.getCsvHeaderMap("Envision Result");

    if (fileContent==null){
      this.eventService.myEvent6.emit('{"ErrorCode":1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }

    let data = this.parseFile(fileContent, fileType);
    if(data.length==0){
      this.eventService.myEvent6.emit('{"ErrorCode":-1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }
    
    let error = this.checkHeader(data[0], map);
    if (error!=null){
      this.eventService.myEvent6.emit(`{"ErrorCode":-1,"ErrorMessage":"${error}","EntityDto":null}`);
      return;
    }

    for (let index = 0; index < data.length; index++) {
      const dataRow = data[index];
      let entity: ImportResultFileDto =
      {
        plateName: dataRow[map["PlateName"]],
        row: dataRow[map["Row"]],
        column: parseInt(dataRow[map["Column"]]),
        result: parseFloat(dataRow[map["Result"]]),
      }
      resultFileLst.push(entity);
    }
    console.log(resultFileLst);
    this.opCompoundLibraryService.importResultFileByPltLst(resultFileLst).subscribe((data) => {
      console.log(data);
      this.eventService.myEvent6.emit(data);
    });
  }


  // 7
  async handle_Echo_Report(fileName: string, fileContent: any, fileType:string): Promise<void> {
    console.log("start handle_Echo_Report..."+fileType);
    let reportItemLst: ReportItemDto[] = new Array<ReportItemDto>();
    let reportName: string = fileName;
    let reportType: string = "Echo";
    
    let map = await this.getCsvHeaderMap("Echo Report");

    if (fileContent==null){
      this.eventService.myEvent7.emit('{"ErrorCode":1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }

    let data = this.parseFile(fileContent, fileType, 0, false);

    if(data.length==0){
      this.eventService.myEvent7.emit('{"ErrorCode":-1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }
    
    // parse csv
    let expStart=false;
    let detStart=false;
    let expHeaderArr = [];
    let detHeaderArr = [];
    let bodyArr = [];
    for (let index = 0; index < data.length; index++) {
      const dataRow = data[index];
      //0.=
      //console.log(dataRow)
      if (dataRow[0] == ""){
        continue;
      }

      if (dataRow[0] == "[EXCEPTIONS]"){
        expStart = true;
        continue;
      }

      if (dataRow[0] == "[DETAILS]"){
        detStart=true;
        expStart = false;
        continue;
      }

      if (dataRow[0]=="Instrument Name"){
        break;
      }

      if (expStart){
        if (expHeaderArr.length==0){
          expHeaderArr = dataRow;
        }else{
          bodyArr.push(dataRow)
        }
      }

      if (detStart){
        if (detHeaderArr.length==0){
          detHeaderArr = dataRow;
        }else{
          bodyArr.push(dataRow)
        }
      }

    }

    // check header
    let error = this.checkHeaderArr(expHeaderArr, map);
    if (error!=null){
      this.eventService.myEvent7.emit(`{"ErrorCode":-1,"ErrorMessage":"${error}","EntityDto":null}`);
      return;
    }

    // generate report dto
    for (let index = 0; index<bodyArr.length; index++){
      const dataRow = bodyArr[index];
      let entity: ReportItemDto =
      {
        reportFk: null,
        dateTimePoint:dataRow[expHeaderArr.findIndex(i => i === map["DateTimePoint"])],
        sourcePlateName: dataRow[expHeaderArr.findIndex(i => i === map["SourcePlateName"])],
        sourcePlateBarcode: dataRow[expHeaderArr.findIndex(i => i === map["SourcePlateBarcode"])],
        sourcePlateType: dataRow[expHeaderArr.findIndex(i => i === map["SourcePlateType"])],
        sourceWell: dataRow[expHeaderArr.findIndex(i => i === map["SourceWell"])],
        destinationPlateBarcode: dataRow[expHeaderArr.findIndex(i => i === map["DestPlateBarcode"])],
        destinationPlateType: dataRow[expHeaderArr.findIndex(i => i === map["DestPlateType"])],
        destinationWell: dataRow[expHeaderArr.findIndex(i => i === map["DestWell"])],
        transferVolumeNL: parseFloat(dataRow[expHeaderArr.findIndex(i => i === map["TransferVolume(nL)"])]),
        actualVolumeNL: parseFloat(dataRow[expHeaderArr.findIndex(i => i === map["ActualVolume(nL)"])]),
        sampleID: dataRow[expHeaderArr.findIndex(i => i === map["SampleID"])],
        sampleName: dataRow[expHeaderArr.findIndex(i => i === map["SampleName"])],
        surveyFluidVolumeUL: parseFloat(dataRow[expHeaderArr.findIndex(i => i === map["SurveyFluidVolume(uL)"])]),
        currentFluidVolumeUL: parseFloat(dataRow[expHeaderArr.findIndex(i => i === map["CurrentFluidVolume(uL)"])]),
        fluidComposition: dataRow[expHeaderArr.findIndex(i => i === map["FluidComposition"])],
        fluidUnits: dataRow[expHeaderArr.findIndex(i => i === map["FluidUnits"])],
        fluidType: dataRow[expHeaderArr.findIndex(i => i === map["FluidType"])],
        transferStatus: dataRow[expHeaderArr.findIndex(i => i === map["TransferStatus"])]
      }
      reportItemLst.push(entity);
    }
    console.log(reportItemLst)

    this.opCompoundLibraryService.importEchoReportItemListByReportNameAndReportTypeAndReportItemList(reportName, reportType, reportItemLst).subscribe((data) => {
      console.log(data);
      this.eventService.myEvent7.emit(data);
    });
  }


  // 8
  async handle_Gene_Marker_Result(fileName: string, fileContent: any, fileType:string, plateName:string, instrument:string): Promise<void> {
    console.log(`start handle_Gene_Marker_Result...${fileType}, ${plateName}, ${instrument}`);
    let resultFileLst: ImportResultFileDto[] = new Array<ImportResultFileDto>();
    let map = await this.getCsvHeaderMap("Envision Result");

    if (fileContent==null){
      this.eventService.myEvent8.emit('{"ErrorCode":1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }

    let data = this.parseFile(fileContent, fileType);
    if(data.length==0){
      this.eventService.myEvent8.emit('{"ErrorCode":-1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }

    // 96 or 384
    let wellResultMap = this.nivoTableToMap(data);
    let signalType = getSignalTypeFromFileName(fileName);

    if(Object.values(wellResultMap).length==0){
      this.eventService.myEvent8.emit('{"ErrorCode":-1,"ErrorMessage":"Cannot parse this file.","EntityDto":null}');
      return;
    }
    if(signalType=="NONE"){
      this.eventService.myEvent8.emit('{"ErrorCode":-1,"ErrorMessage":"The file name is not standardized. The following fields are required, FAM/HEX/ROX.","EntityDto":null}');
      return;
    }

    for (let well in wellResultMap) {
      console.log(well, wellResultMap[well]);
      let result = wellResultMap[well];
      let rc = wellToRowCol(well);
      let famCheck = x => (x == "FAM" ?  result: 0);
      let roxCheck = x => (x == "ROX" ?  result: 0);
      let hexCheck = x => (x == "HEX" ?  result: 0);
      
      let entity: ImportResultFileDto =
      {
        plateName: plateName,
        row: rc.row,
        column: rc.col,
        fam: famCheck(signalType),
        rox: roxCheck(signalType),
        hex: hexCheck(signalType),
      }
      resultFileLst.push(entity);
    }
    

    console.log(resultFileLst);
    this.opCompoundLibraryService.importNivoResultByPltLst(resultFileLst).subscribe((data) => {
      console.log(data);
      this.eventService.myEvent8.emit(data);
    });
    
  }


  // 9
  async handle_Sample_Plate(fileContent: any, fileType:string): Promise<void> {
    console.log("start handle_Sample_Plate..."+fileType);
    let liquidPlateLst: ImportLiquidPlateDto[] = new Array<ImportLiquidPlateDto>();
    let map = await this.getCsvHeaderMap("Sample Plate");

    if (fileContent==null){
      this.eventService.myEvent9.emit('{"ErrorCode":1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }

    let data = this.parseFile(fileContent, fileType);
    if(data.length==0){
      this.eventService.myEvent9.emit('{"ErrorCode":-1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }
    
    let error = this.checkHeader(data[0], map);
    if (error!=null){
      this.eventService.myEvent9.emit(`{"ErrorCode":-1,"ErrorMessage":"${error}","EntityDto":null}`);
      return;
    }

    for (let index = 0; index < data.length; index++) {
      const dataRow = data[index];
      let entity: ImportLiquidPlateDto =
      {
        plateName: dataRow[map["PlateName"]],
        plateType: dataRow[map["PlateType"]],
        row: dataRow[map["Row"]],
        column: parseInt(dataRow[map["Column"]]),
        name: dataRow[map["SampleName"]],
        volume: parseFloat(dataRow[map["Volume(ul)"]]),
        sampleID: dataRow[map["SampleName"]],
        // geneFunction: dataRow[map["GeneFunction"]],
        // geneCDS: dataRow[map["GeneCDS"]],
        // geneDonors: dataRow[map["GeneDonors"]],
        // geneSequence: dataRow[map["GeneSequence"]],
        // geneStrand: stringToBoolean(dataRow[map["GeneStrand"]]),
        // geneLocation: parseInt(dataRow[map["GeneLocation"]]),
        primerList: null
      }
      liquidPlateLst.push(entity);
    }
    console.log(liquidPlateLst);
    this.opCompoundLibraryService.importSamplePlateByLiquidPlateLst(liquidPlateLst).subscribe((data) => {
      console.log(data);
      this.eventService.myEvent9.emit(data);
    });
  }


  // 10
  async handle_Marker_Plate(fileContent: any, fileType:string): Promise<void> {
    console.log("start handle_Marker_Plate..."+fileType);
    let liquidPlateLst: ImportLiquidPlateDto[] = new Array<ImportLiquidPlateDto>();
    let map = await this.getCsvHeaderMap("Marker Plate");

    if (fileContent==null){
      this.eventService.myEvent10.emit('{"ErrorCode":1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }

    let data = this.parseFile(fileContent, fileType);
    if(data.length==0){
      this.eventService.myEvent10.emit('{"ErrorCode":-1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }
    
    let error = this.checkHeader(data[0], map);
    if (error!=null){
      this.eventService.myEvent10.emit(`{"ErrorCode":-1,"ErrorMessage":"${error}","EntityDto":null}`);
      return;
    }

    for (let index = 0; index < data.length; index++) {
      const dataRow = data[index];
      let entity: ImportLiquidPlateDto =
      {
        plateName: dataRow[map["PlateName"]],
        plateType: dataRow[map["PlateType"]],
        row: dataRow[map["Row"]],
        column: parseInt(dataRow[map["Column"]]),
        name: dataRow[map["MarkerName"]],
        volume: parseFloat(dataRow[map["Volume(ul)"]]),
        markerID: dataRow[map["MarkerID"]],
        markerDescription: dataRow[map["MarkerDescription"]],
        primerList: dataRow[map["PrimerList"]].trim().split(","),
        alleleOfFAM: strToNucleobase(dataRow[map["AlleleOfFAM"]]),
        alleleOfHEX: strToNucleobase(dataRow[map["AlleleOfHEX"]]),
      }
      liquidPlateLst.push(entity);
    }
    console.log(liquidPlateLst);
    this.opCompoundLibraryService.importMarkerPlateByLiquidPlateLst(liquidPlateLst).subscribe((data) => {
      console.log(data);
      this.eventService.myEvent10.emit(data);
    });
  }


  // 11
  async handle_Gene_Marker_Mix(fileContent: any, fileType:string): Promise<void> {
    console.log("start handle_Gene_Marker_Mix..."+fileType);
    let pickLst: LiquidTransferHistoryDto[] = new Array<LiquidTransferHistoryDto>();
    let map = await this.getCsvHeaderMap("Pick List");

    if (fileContent==null){
      this.eventService.myEvent11.emit('{"ErrorCode":1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }

    let data = this.parseFile(fileContent, fileType);
    if(data.length==0){
      this.eventService.myEvent11.emit('{"ErrorCode":-1,"ErrorMessage":"No data.","EntityDto":null}');
      return;
    }
    
    let error = this.checkHeader(data[0], map);
    if (error!=null){
      this.eventService.myEvent11.emit(`{"ErrorCode":-1,"ErrorMessage":"${error}","EntityDto":null}`);
      return;
    }

    for (let index = 0; index < data.length; index++) {
      const dataRow = data[index];

      let instument:InstrumentDto = {name:"VirtualInstrument"};
      let sourP:PlateDto = {
        name: dataRow[map["SourcePlateName"]], plateSize: 0,
        plateChildrenList: []
      };
      let sourPC: PlateChildDto = {
        plateFk: sourP,
        column: parseInt(dataRow[map["SourcePlateColumn"]]),
        row: dataRow[map["SourcePlateRow"]]
      }
      let destP:PlateDto = {
        name: dataRow[map["DestPlateName"]], plateSize: 0,
        plateChildrenList: []
      };
      let destPC: PlateChildDto = {
        plateFk: destP,
        column: parseInt(dataRow[map["DestPlateColumn"]]),
        row: dataRow[map["DestPlateRow"]]
      };
      
      let entity: LiquidTransferHistoryDto =
      {
        sourcePlateChildFk: sourPC,
        destinationPlateChildFk: destPC,
        transferVolume: parseFloat(dataRow[map["Volume"]]),
        instrumentFk: instument,
        transferType: TransferType.Mix,
        sourceLiquidFk: undefined,
        destinationLiquidFk: undefined,
        finalLiquidFk: undefined
      }
      pickLst.push(entity);
    }
    console.log(pickLst);
    this.opCompoundLibraryService.importSampleMarkerMixByPickLst(pickLst).subscribe((data) => {
      console.log(data);
      this.eventService.myEvent11.emit(data);
    });
  }




  // Utility

  parseFile(fileContent:any, fileType:string, sheetNum:number=0, hasHeader=true):any[]{
    if(fileType=="Excel"){
      return this.parseExcelFile(fileContent,sheetNum);
    }else if(fileType=="Csv"){
      return this.parseCsvFile(fileContent,hasHeader);
    }
  }

  parseExcelFile(fileContent: any, sheet: number): any[] {
    const workbook = XLSX.read(fileContent, { type: 'binary' });
    const sheetName = workbook.SheetNames[sheet];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet, { raw: true });
  }

  parseCsvFile(fileContent: any, hasHeader: boolean = true): any[] {
    const result = Papa.parse(fileContent, {
      header: hasHeader,
      skipEmptyLines: true
    });
    return result.data;
  }


  async getCsvHeaderMap(csvName:string){
    let map : CsvHeaderMap={};
    const data: CsvHeaderDto[] = await lastValueFrom(this.csvHeaderService.getCsvHeadersByCsvFileName(csvName));
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      map[item.headerName] = item.actualValue
    }
    return map;
  }


  checkHeader(header:any, map:CsvHeaderMap){
    if (Object.keys(map).length==0) {
      return `Cannot find csv header map. `;
    }
    for (const key in map) {
      const value = map[key];
      console.log(`Key: ${key}, Value: ${value}`);
      if (!header.hasOwnProperty(value.trim())) {
        return `Cannot find header [${value}] in CSV. HeaderName: ${key}, ActualValue: ${value}. `;
      }
    }
    return null;
  }

  checkHeaderArr(header:Array<string>, map:CsvHeaderMap){
    for (const key in map) {
      const value = map[key];
      //console.log(`Key: ${key}, Value: ${value}`);
      if (!header.includes(value.trim())) {
        return `Cannot find header [${value}] in CSV. HeaderName: ${key}, ActualValue: ${value}. `;
      }
    }
    return null;
  }


  nivoTableToMap(data: any){
    console.log(data);
    // find column row
    let plateResultMap :PlateResultMap = {};

    let plateSize = 0;
    let plateColIndex = 0;
    let foundCol = false;

    for (let r = 0; r < data.length; r++) {
      const row = data[r];
      const values = Object.values(row);
      let colLst = new Array<any>();
      for (let k = 0; k < values.length; k++) {
        let value = values[k];
        if (value!=undefined&&value!=null&&value!=""){
          colLst.push(value);
        }
      }

      if (colLst.length==12&&colLst[0]==1&&colLst[11]==12) {
        plateSize = 96;
      }else if(colLst.length==24&&colLst[0]==1&&colLst[23]==24){
        plateSize = 384;
      }else if(colLst.length==48&&colLst[0]==1&&colLst[47]==48){
        plateSize = 1536;
      }
      if (plateSize>0){
        foundCol = true;
        plateColIndex = r;
        break;
      }
    }
    console.log(`find plate map:[${foundCol}], PlateColumn index:[${plateColIndex}]; Size:[${plateSize}]`);

    if (!foundCol) return plateResultMap;
    
    // generate 

    if (plateSize==96){
      console.log(`start generate 96 map`)
      for (let r = 1; r < 9; r++) {
        let row = r + plateColIndex
        console.log(data[row]);
        
      }
    }else if (plateSize==384){
      console.log(`start generate 384 map`)
      for (let r = 1; r < 17; r++) {
        let row = r + plateColIndex
        //console.log(data[row]);
        let values = Object.values(data[row])
        for (let c = 1; c< 25; c++){
          let rowName = values[0]
          let wellName = `${rowName}${c}`
          if(!isNumber(values[c])){
            continue;
          }
          let wellResult = values[c] as number;
          plateResultMap[wellName] = wellResult
          //console.log(`${wellName}: ${wellResult}`)
        }
      }
    }else{
      console.log(`start generate 1536 map`)
      for (let r = 1; r < 33; r++) {
        let row = r + plateColIndex
        console.log(data[row]);
        
      }
    }

    console.log(plateResultMap)
    console.log(Object.values(plateResultMap).length)
    return plateResultMap;
  }




}


function stringToBoolean(value: string): boolean {
  const trueValues = ["true", "1"];
  return trueValues.includes(value.toLowerCase());
}

function strToNucleobase(base: string): Nucleobase {
  if (base==undefined) {
    return Nucleobase.None;
  }
  switch (base.toUpperCase()) {
    case "A":
      return Nucleobase.A;
    case "T":
      return Nucleobase.T;
    case "G":
      return Nucleobase.G;
    case "C":
      return Nucleobase.C;
    case "NONE":
      return Nucleobase.None;
    default:
      return Nucleobase.None;
  }
}




function getSignalTypeFromFileName(filename:string):string{
  let name = filename.toUpperCase();
  if (name.includes("FAM")) {
    return "FAM"
  } 
  else if (name.includes("ROX")) {
    return "ROX"
  }
  else if (name.includes("HEX")) {
    return "HEX"
  }else {
    return "NONE"
  }
}



function wellToRowCol(input: string): { row: string; col: number } {
  const match = input.match(/[A-Za-z]+|[0-9]+/g);
  if (match && match.length === 2) {
    const col = parseInt(match[1], 10);
    return { row: match[0], col };
  } else {
    return {row:"",col:0};
  }
}



function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}










interface CsvHeaderMap {
  [key: string]: string;
}

interface PlateResultMap {
  [key: string]: any;
}

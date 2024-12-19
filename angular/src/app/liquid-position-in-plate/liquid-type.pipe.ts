import { Pipe, PipeTransform } from '@angular/core';
import { LiquidType } from '@proxy/enum';


@Pipe({
  name: 'liquidType'
})
export class LiquidTypePipe implements PipeTransform {
  transform(value: LiquidType): string {
    switch (value) {
      case LiquidType.None:
        return 'None';
      case LiquidType.Compound:
        return 'Compound';
      case LiquidType.Cell:
        return 'Cell';
      case LiquidType.CompoundCellMix:
        return 'Compound Cell Mix';
      case LiquidType.DMSO:
        return 'DMSO';
      case LiquidType.Gene:
        return 'Gene';
      case LiquidType.Marker:
        return 'Marker';
      case LiquidType.GeneMarkerMix:
        return 'GeneMarkerMix';
      default:
        return 'Unknown';
    }
  }
}

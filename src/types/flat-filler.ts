import TSS = GoogleAppsScript.Spreadsheet;
import { Flat } from './flat.type';

export class FlatFiller {

    public fillFlat(cell: TSS.Range, flat: Flat): void {
        console.log(cell.getA1Notation(), flat);
    }

}

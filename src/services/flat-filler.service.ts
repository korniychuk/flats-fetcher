import TSS = GoogleAppsScript.Spreadsheet;
import {
    EColumn,
    Flat,
} from '../types';

export class FlatFillerService {
    private sheet: TSS.Sheet;

    public constructor() {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        this.sheet = ss.getActiveSheet();
    }

    public fillFlat(linkCell: TSS.Range, flat: Flat): void {
        this.writeIfEmpty(linkCell, EColumn.Address, flat.address);
    }

    private writeIfEmpty(linkCell: TSS.Range, col: EColumn, value: string | number): void {
        const cell = this.sheet.getRange(linkCell.getRow(), col);
        if (!!cell.getValue()) return;
        typeof value === 'string' && value[0] === '=' ? cell.setFormula(value) : cell.setValue(value);
    }

}

import TSS = GoogleAppsScript.Spreadsheet;
import {
    EColumn,
    Flat,
} from '../types';
import { TextEngineService } from './text-engine.service';

export class FlatFillerService {
    private sheet: TSS.Sheet;

    public constructor(
        private t: TextEngineService,
    ) {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        this.sheet = ss.getActiveSheet();
    }

    public fillFlat(linkCell: TSS.Range, flat: Flat): void {
        this.writeIfEmpty(linkCell, EColumn.Complex, () => this.t.prepareComplex(flat.complex));
        this.writeIfEmpty(linkCell, EColumn.Coordinates, () => this.t.prepareAddress(flat.coordinates));
        this.writeIfEmpty(linkCell, EColumn.Address, () => this.t.prepareAddress(flat.address));
        this.writeIfEmpty(linkCell, EColumn.Price, () => flat.price);
        this.writeIfEmpty(linkCell, EColumn.Rooms, () => flat.rooms);
        this.writeIfEmpty(linkCell, EColumn.Info, () => flat.info);
        this.writeIfEmpty(linkCell, EColumn.Description, () => flat.description);
        this.writeIfEmpty(linkCell, EColumn.Images, () => flat.images);
    }

    private writeIfEmpty(linkCell: TSS.Range, col: EColumn, valueFn: () => string | number | string[]): void {
        const cell = this.sheet.getRange(linkCell.getRow(), col);
        if (!!cell.getValue()) return;
        const value = valueFn();
        if (Array.isArray(value)) {
            const range = this.sheet.getRange(linkCell.getRow(), col, 1, value.length)
            typeof value[0] === 'string' && value[0][0] === '=' ? range.setFormulas([value]) : range.setValues([value]);
        } else {
            typeof value === 'string' && value[0] === '=' ? cell.setFormula(value) : cell.setValue(value);
        }
    }

}

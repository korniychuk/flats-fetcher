import { DI } from './di';
import { EColumn } from './types';
import {
  error,
  warn,
} from './dialogs';
import {
  FlatFillerService,
  FlatParserStrategyService,
} from './services';

export function onOpen() {
  const ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Flats Fetcher')
    .addItem('Refresh URLs', 'App.refresh')
      //.addSeparator()
      //.addSubMenu(ui.createMenu('Sub-menu')
      //    .addItem('Second item', 'menuItem2'))
    .addToUi();
}

export function refresh(): void {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const range = sheet.getActiveRange();

  if (!range) return error('No cells selected');
  if (range.getWidth() > 1) return error('Please don\'t select more than one column at the same time.');
  if (range.getColumn() !== EColumn.Link) return error('This function works only with "Link" (number 7) column');

  const urls: string[] = range.getValues()[0];
  const parserChooser = DI.get(FlatParserStrategyService);
  const filler = DI.get(FlatFillerService);
  console.log('URLs:', urls);

  const unsupportedUrls: string[] = [];
  urls.forEach((url, i) => {
    const parser = parserChooser.get(url);
    if (!parser) {
      unsupportedUrls.push(url);
      return;
    }
    const flat = parser.parse(url);
    filler.fillFlat(range.getCell(i + 1, 1), flat);
  });

  if (!_.isEmpty(unsupportedUrls)) {
    warn(`Next URLs are not supported:\n  - ${unsupportedUrls.join('\n  - ')}`);
  }
}

// /**
//  * @param {Range} cell
//  */
// function handleRow(cell: TSS.Range) {
//
// }

// /**
//  * Fetches flat info
//  *
//  * @OnlyCurrentDoc
//  * @Param {string} url a URL to parse
//  * @customFunction
//  */
// function parseFlat(url: string) {
//     let data;
//     if (/\/dimdim.ua\/rent\/apartment\//.test(url)) data = parseDimDimFlat(url);
//
//     if (!data) throw new Error(`No result of parsing`);
//       const ss = SpreadsheetApp.getActiveSpreadsheet();
//     const sheet = ss.getActiveSheet();
//     const currCellRange = sheet.getCurrentCell();
// //  return [[3, IMAGE("https://lunappimg.appspot.com/lun-ua/592/360/images-cropped/697749855.jpg")]];
//     //data = [[3,5,'=3*55']];
//     // currCellRange.setFormulas(111)
//     // fillRow(data);
//   return '';
// }
//
// function parseDimDimFlat(url: string) {
//     const err = makeThrower('DimDim Parser');
//     const flatId = url.match(/\/apartment\/(?<id>\d+)/).groups.id;
//     if (!flatId) err('Can\'t fetch flatId');
//
//     const response = UrlFetchApp.fetch(`https://dimdim.wrenchtech.io/api/flats/?ids=${ flatId }`);
//     const data = JSON.parse(response.getContentText()).results[0];
//
//     return {
//         address: data.address_raw,
//     };
// }
//
// /**
//  * @OnlyCurrentDoc
//  */
// function fillRow(data) {
//     const ss = SpreadsheetApp.getActiveSpreadsheet();
//     const sheet = ss.getActiveSheet();
//     const currCellRange = sheet.getActiveCell();
//     const currColN = currCellRange.getColumn();
//     currCellRange.setValue('aoeuao')
// }
//
// function makeThrower(name) {
//     return (text) => {
//         throw new Error(`${name}: ${text}`);
//     };
// }

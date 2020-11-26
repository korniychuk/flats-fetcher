import TSS = GoogleAppsScript.Spreadsheet;

// @ts-ignore
const _ = LodashGS.load();

import { hello } from './lib';

const ECol: any =
  ['Id', 'Complex', 'Coordinates', 'Address', 'Money', 'RoomCount', 'Info', 'Link', 'Description', 'Phone', 'View', 'Note', 'Images']
      .reduce((obj, key, i) => ({...obj, [key]: i + 1}), {}); /* ? */


function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Flats Fetcher')
      .addItem('Refrash URLs', 'refresh')
      //.addSeparator()
      //.addSubMenu(ui.createMenu('Sub-menu')
      //    .addItem('Second item', 'menuItem2'))
      .addToUi();
}

function refresh() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const range = sheet.getActiveRange();
  if (range.getWidth() > 1) return error('Please don\'t select more than one column at the same time.');
  if (range.getColumn() !== ECol.Link) return error('This function works only with "Link" (number 7) column');

  const URLs = range.getValues()[0];
  hello();

  // console.log(range.getColumn());
  // range.setValue(111);
  // range.setFormula('=IMAGE("https://crm-08498194.s3.eu-west-1.amazonaws.com/capital/estate-images/watermark/ce8ecb379141877a3860ecbdd0a62d6d.jpg")');
  // Logger.log('Test log');
  // console.log('aoeu test');
  // SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
     // .alert('You clicked the first menu item!');
}

function error(text: string) {
  SpreadsheetApp.getUi().alert(`ERROR: ${text}`);
}

/**
 * @param {Range} cell
 */
function handleRow(cell: TSS.Range) {

}

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

import { PdfReader } from "pdfreader";
import fs from 'fs';

const dataArray = [];

const getColumn = item => {
  if ( item.x > 3 && item.x < 5 ) {
    return 'type';
  } else if ( item.x > 7 && item.x < 9 ) {
    return 'country';
  } else if ( item.x > 9 && item.x < 11 ) {
    return 'city';
  } else if ( item.x > 11 && item.x < 21 ) {
    return 'description';
  } else if ( item.x > 21 && item.x < 30 ) {
    return 'loc';
  } else if ( item.x > 30 && item.x < 34 ) {
    return 'use';
  } else if ( item.x > 34 && item.x < 38 ) {
    return 'surface';
  } else if ( item.x > 38 && item.x < 42 ) {
    return 'acquisition_date';
  } else if ( item.x > 42 ) {
    return 'acquisition_mode';
  } else return null;
}

let lastItemY = 0;
let row = 0;
const getRow = item => {
  if ( item.y - lastItemY < -10 ) {
    lastItemY = 0;
  }

  if ( item.y - lastItemY > 1 ) {
    lastItemY = item.y;
    row++;
  }



  return row;
}

new PdfReader().parseFileItems("./inmuebles.pdf", (err, item) => {
  if (err) console.error("error:", err);
  else if (!item) {
    fs.writeFileSync('./inmuebles.json', JSON.stringify(dataArray, null, 2))
  }
  else if (item.text) {
    if ( item.text.trim() === 'BIENES INMUEBLES AYUNTAMIENTO DE LLÍRIA') return;
    if ( item.text.trim() === 'Fecha actualización: Septiembre 2022.') return;
    if ( item.y <= 7.148 ) return;

    dataArray.push({
      text: item.text,
      column: getColumn(item),
      row: getRow(item),
    });
  }
});

import dotenv from 'dotenv';
dotenv.config();
import { PdfReader } from "pdfreader";
import fs from 'fs';
import axios from 'axios';
import { Parser } from '@json2csv/plainjs';

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
    return 'address';
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

const getCoords = async (item) => {
  var config = {
    method: 'get',
    url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${item.address},${item.city}.json`,
    params: {
      limit: 1,
      access_token: process.env.MAPBOX_API_KEY,
    },
    headers: { }
  };

  const res = await axios(config);
  const center = res.data.features[0].center;

  return {
    lat: center[1],
    lon: center[0],
  }
}

const writeJson = async data => {
  const output = [];
  let row = 1;
  let rowItem = {};

  for (const item of data) {
    if ( item.row !== row ) {
      const prop = {
        ...rowItem,
        ...(await getCoords(rowItem)),
      };
      output.push(prop);
      rowItem = {};
      row = item.row;
    }

    rowItem.row = item.row;

    if ( rowItem[item.column] ) {
      rowItem[item.column] += item.text;
    } else {
      rowItem[item.column] = item.text;
    }
  }

  const prop = {
    ...rowItem,
    ...(await getCoords(rowItem)),
  };
  output.push(prop);

  fs.writeFileSync('./output.json', JSON.stringify(output, null, 2));

  try {
    const parser = new Parser();
    const csv = parser.parse(output);
    fs.writeFileSync('./output.csv', csv);
  } catch (err) {
    console.error(err);
  }
}

const dataArray = [];
new PdfReader().parseFileItems("./inmuebles.pdf", (err, item) => {
  if (err) console.error("error:", err);
  else if (!item) {
    writeJson(dataArray);
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

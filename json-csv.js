import { Parser } from '@json2csv/plainjs';
import fs from 'fs';

(async () => {
  try {
    const data = await fs.readFileSync('./output-coords.json');
    const properties = JSON.parse(data);
    const parser = new Parser();
    const csv = parser.parse(properties.map(p => ({
      name: p.description,
      lat: p.lat,
      lon: p.lon,
    })));
    fs.writeFileSync('./bienes-inmuebles-lliria.csv', csv);
  } catch (err) {
    console.error(err);
  }
})();

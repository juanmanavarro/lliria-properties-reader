import fs from 'fs';

(async () => {
  const data = fs.readFileSync('./inmuebles.json');
  const dataArray = JSON.parse(data);
  const output = [];
  let row = 1;
  let rowItem = {};

  for (const item of dataArray) {
    if ( item.row !== row ) {
      output.push(rowItem);
      rowItem = {};
      row = item.row;
    }

    rowItem.row = item.row;

    if ( rowItem[item.column] ) {
      rowItem[item.column] += item.text;
    } else {
      rowItem[item.column] = item.text;
    }

    console.log(rowItem);
    console.log(item.row, row);

  }

  output.push(rowItem);

  console.log(output);

  fs.writeFileSync('./output.json', JSON.stringify(output, null, 2));
})();

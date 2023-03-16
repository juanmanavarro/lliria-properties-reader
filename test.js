import fs from 'fs';

const output = fs.readFileSync('./output.json');
const outputData = JSON.parse(output);

console.log('87 properties:', outputData.length === 87);
console.log(outputData.map(d => d.type));

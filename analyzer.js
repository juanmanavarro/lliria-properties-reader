import fs from 'fs';

const output = fs.readFileSync('./output.json');
const outputData = JSON.parse(output);

console.log(outputData.map(d => d.type));

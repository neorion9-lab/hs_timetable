import xlsx from 'xlsx';
import fs from 'fs';

const files = fs.readdirSync('./');
const targetFile = files.find(f => f.endsWith('.xlsx'));
if (!targetFile) throw new Error('No xlsx file found');

const workbook = xlsx.readFile(targetFile);

const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

console.log('--- SHEET: ' + sheetName + ' ---');
for (let i = 0; i < Math.min(jsonData.length, 25); i++) {
  console.log(JSON.stringify(jsonData[i]));
}

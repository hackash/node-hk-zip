import { ZipFile } from './lib/ZipFile';

const fs = require('fs');

const buffer = fs.readFileSync('./assets/test-zip.zip');

const zip = new ZipFile(buffer);
const entries = zip.listEntries();

entries.forEach(async (e) => {
  // const data = await e.getData();
  // console.log('data', data);
  //await e.getData();
  console.log('describe', e.describe());
});

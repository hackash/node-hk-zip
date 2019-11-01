import { ZipFile } from './lib/ZipFile';

const fs = require('fs');

const buffer = fs.readFileSync('./assets/L1BRE.zip');

const zip = new ZipFile(buffer);
const entries = zip.listEntries();

entries.forEach(e => {
  console.log(e.getInfo())
});

/*console.log(entries);*/

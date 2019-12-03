import { ZipFile } from './lib/ZipFile';
import { ZipEntry } from './lib/ZipEntry';

const fs = require('fs');

const buffer = fs.readFileSync('./assets/test.zip');

const zip = new ZipFile(buffer);
const entries = zip.findEntries([]);

entries.forEach(async (e: ZipEntry) => {
  console.log('e', e.describe());
});

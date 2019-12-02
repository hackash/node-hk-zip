import { ZipFile } from './lib/ZipFile';
import { ZipEntry } from './lib/ZipEntry';

const fs = require('fs');

const buffer = fs.readFileSync('./assets/test-zip.zip');

const zip = new ZipFile(buffer);
const entries = zip.listEntries();

entries.forEach(async (e: ZipEntry) => {
  // const data = await e.getData();
  // console.log('data', data);
  //await e.getData();
  const data =  await e.decompress();
  console.log('describe',data.toString());
});

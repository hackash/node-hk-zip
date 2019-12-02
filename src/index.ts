import { ZipFile } from './lib/ZipFile';
import { ZipEntry } from './lib/ZipEntry';

const fs = require('fs');

const buffer = fs.readFileSync('./assets/app-debug.apk');

const zip = new ZipFile(buffer);
const entries = zip.findEntries(['res/mipmap-hdpi-v4/icon.png']);

entries.forEach(async (e: ZipEntry) => {
  if (!e.isDirectory()) {
    const data = await e.decompress();
    console.log('e.getName', e.getName());
    fs.writeFile(e.getName(), data, () => {
      console.log('done');
    });
  }
});

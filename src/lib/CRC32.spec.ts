// tslint:disable-next-line:no-implicit-dependencies
import test from 'ava';

import fs from 'fs';

import { ZipFile } from './ZipFile';
import { ZipEntry } from './ZipEntry';
import CRC32 from './CRC32';

test.beforeEach(t => {
  const data = fs.readFileSync('assets/test.zip');
  t.context = {
    zip: new ZipFile(data)
  };
});

test(
  'CRC32 verification',
  async (t, filename: string) => {
    // tslint:disable-next-line:no-string-literal
    const entries: ZipEntry[] = t.context['zip'].findEntries([filename]);
    t.is(entries.length, 1);
    const entry = entries[0];
    const crc = entry.getCRC32();
    const data = await entry.decompress();
    t.is(crc, CRC32.calculate(data));
  },
  'test.txt'
);

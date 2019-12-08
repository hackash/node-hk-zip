// tslint:disable-next-line:no-implicit-dependencies
import test from 'ava';
import fs from 'fs';

import { ZipEntry } from './ZipEntry';
import { ZipFile } from './ZipFile';

test.beforeEach(t => {
  const data = fs.readFileSync('assets/test.zip');
  t.context = {
    zip: new ZipFile(data)
  };
});

test(
  'List all entries (MAC OSX)',
  (t, count: number) => {
    // tslint:disable-next-line:no-string-literal
    const entries = t.context['zip'].listAllEntries();
    t.is(entries.length, count);
  },
  5
);

test(
  'Look for existing entry in ZIP file',
  (t, filename: string) => {
    // tslint:disable-next-line:no-string-literal
    const entries: ZipEntry[] = t.context['zip'].findEntries([filename]);
    t.is(entries.length, 1);
    t.is(entries[0].getName(), filename);
  },
  'test.txt'
);

test(
  'Look for nonexistent entry in ZIP file',
  (t, filename: string) => {
    // tslint:disable-next-line:no-string-literal
    const entries: ZipEntry[] = t.context['zip'].findEntries([filename]);
    t.is(entries.length, 0);
  },
  'does-not-exist.txt'
);

test(
  'Search entry by regexp in ZIP file',
  (t, reg: RegExp, filename: string) => {
    // tslint:disable-next-line:no-string-literal
    const entries: ZipEntry[] = t.context['zip'].findMatchingEntries(reg);
    t.is(entries.length, 1);
    const entry = entries[0];
    t.is(entry.getName(), filename);
  },
  /^[a-z]+\.(png)/, 'test.png'
);

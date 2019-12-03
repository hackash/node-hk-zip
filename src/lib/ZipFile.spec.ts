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

test('List all entries (MAC OSX)', (t, count: number) => {
  const entries = t.context['zip'].listAllEntries();
  t.is(entries.length, count);
}, 5);

test('Look for existing entry in ZIP file', (t, filename: string) => {
  const texts: Array<ZipEntry> = t.context['zip'].findEntries([filename]);
  t.is(texts.length, 1);
  t.is(texts[0].getName(), filename);
}, 'test.txt');

test('Look for nonexistent entry in ZIP file', (t, filename: string) => {
  const entries: Array<ZipEntry> = t.context['zip'].findEntries([filename]);
  t.is(entries.length, 0);
}, 'does-not-exist.txt');

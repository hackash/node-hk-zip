import test from 'ava';

import fs from 'fs';
import { ZipEntryDescription } from './interfaces/ZipEntryDescription';

import { ZipEntry } from './ZipEntry';
import { ZipFile } from './ZipFile';

test.beforeEach(t => {
  const data = fs.readFileSync('assets/test.zip');
  t.context = {
    zip: new ZipFile(data)
  };
});

test('Get local header size', (t, count: number, length: number) => {
  const entries: ZipEntry[] = t.context['zip'].findEntries(['test.txt']);
  t.is(entries.length, length);
  t.is(entries[0].getLocalHeaderSize(), count);
}, 66, 1);

test('Is entry a directory', (t, length: number, dirpath: string) => {
  const entries: ZipEntry[] = t.context['zip'].findEntries([dirpath]);
  t.is(entries.length, length);
  t.is(entries[0].getPath(), dirpath);
  t.is(entries[0].isDirectory(), true);
}, 1, '__MACOSX/');

test('Get entry name', (t, length: number, filename: string) => {
  const entries: ZipEntry[] = t.context['zip'].findEntries([filename]);
  t.is(entries.length, length);
  t.is(entries[0].getName(), filename);
}, 1, 'test.png');

test('Get entry path', (t, length: number, path: string) => {
  const entries: ZipEntry[] = t.context['zip'].findEntries([path]);
  t.is(entries.length, length);
  t.is(entries[0].getPath(), path);
}, 1, '__MACOSX/');

test('Describe entry', (t, length: number, filename: string) => {
  const entries: ZipEntry[] = t.context['zip'].findEntries([filename]);
  t.is(entries.length, length);
  const entry = entries[0];
  t.is(entry.getName(), filename);
  const desc: ZipEntryDescription = entry.describe();
  t.is(desc.path, entry.getPath());
  t.is(desc.isDirectory, entry.isDirectory());
  t.is(desc.name, entry.getName());
}, 1, 'test.png');

test('Decompress entry', async (t, length: number, filename: string, fileContent: string) => {
  const entries: ZipEntry[] = t.context['zip'].findEntries([filename]);
  t.is(entries.length, length);
  const entry = entries[0];
  const data = await entry.decompress();
  t.is(data.toString(), fileContent);
}, 1, 'test.txt', 'TEST FILE FOR ZIP PROGRAM');

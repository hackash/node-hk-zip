# NodeJS unzip implementation

>This module has been developed for a specific use case (unzipping specific files with a flexible API). It supports only the most common compression method deflate. There are some missing features, such as CRC check, encrypted files, and ZIP 64 support. I plan to add them later. if you like this and want to enhance/add missing features or add more public functions, feel free to come up with a pull request, but before doing that, please check [CONTRIBUTING.md](https://github.com/hackash/node-hk-zip/blob/master/.github/CONTRIBUTING.md)


## Motivation 

> Most of the open-source ZIP libraries are written in old javascript, weakly tested, not well structured, and mostly depending on other open-source libraries, which makes it hard to manage, perform patches, and updates. This module is written in Typescript. Which allows to create more abstractions around the idea, provides type checking and OOP capabilities.
  
## Installation 

#### NPM 

```npm install node-hk-zip```

#### Yarn

```yarn add node-hk-zip``` 


## Getting started

``` 
 import {ZipFile, ZipEntry} from 'node-hk-zip';
 import fs from 'fs';
 
 const data: Buffer = fs.readFileSync('..some zip file path'); // IMPORTANT: Usage of sync method for demo purposes only
 
 const zip: ZipFile = new ZipFile(data);
 const entries: ZipEntry[] = zip.listAllEntries();
 
 entries.forEach((e: ZipEntry) => {
    console.log(e.describe());
    console.log(e.decompress());
 });
```

## ZipFile API

List all entries in the ZIP file - `listAllEntries(): ZipEntry[]` 


``` 
 import {ZipFile, ZipEntry} from 'node-hk-zip';
 import fs from 'fs';
 
 const data: Buffer = fs.readFileSync('..some zip file path'); // IMPORTANT: Usage of sync method for demo purposes only
 
 const zip: ZipFile = new ZipFile(data);
 const entries: ZipEntry[] = zip.listAllEntries();
 
 entries.forEach((e: ZipEntry) => {
    console.log(e.describe());
 });
```

> Sample output

```
{ isDirectory: false, name: 'test.png', path: 'test.png' }
{ isDirectory: true, name: '__MACOSX', path: '__MACOSX/' }
{ isDirectory: false, name: '._test.png', path: '__MACOSX/._test.png' }
{ isDirectory: false, name: 'test.txt', path: 'test.txt' }
{ isDirectory: false, name: '._test.txt',path: '__MACOSX/._test.txt' }
```

Find an entry in the ZIP file - `findEntries(string[]): ZipEntry[]` 


``` 
 import {ZipFile, ZipEntry} from 'node-hk-zip';
 import fs from 'fs';
 
 const data: Buffer = fs.readFileSync('..some zip file path'); // IMPORTANT: Usage of sync method for demo purposes only
 
 const zip: ZipFile = new ZipFile(data);
 const paths: string[] = ['test.png'];
 const entries: ZipEntry[] = zip.findEntries(paths);
 
 entries.forEach((e: ZipEntry) => {
    console.log(e.describe());
 });
```

> Sample output

```
{ isDirectory: false, name: 'test.png', path: 'test.png' }
```

## ZipEntry API

Decompress file data - `decompress(): Promise<Buffer>` 

``` 
 import { ZipFile, ZipEntry } from 'node-hk-zip';
 import fs from 'fs';
 
 const data: Buffer = fs.readFileSync('..some zip file path'); // IMPORTANT: Usage of sync method for demo purposes only
 
 const zip: ZipFile = new ZipFile(data);
 const paths: string[] = ['test.png'];
 const entries: ZipEntry[] = zip.findEntries(paths);
 
 entries.forEach(async (e: ZipEntry) => {
   const info = e.describe();
   const data = await e.decompress();
   fs.writeFileSync(info.name, data); // IMPORTANT: Usage of sync method for demo purposes only
 });
```

> Sample output

Writes decompressed `test.png` under project root.  

Getter for LocalFileHeader size - `getLocalHeaderSize(): number` 

``` 
 import { ZipFile, ZipEntry } from 'node-hk-zip';
 import fs from 'fs';
 
 const data: Buffer = fs.readFileSync('..some zip file path'); // IMPORTANT: Usage of sync method for demo purposes only
 
 const zip: ZipFile = new ZipFile(data);
 const paths: string[] = ['test.png'];
 const entries: ZipEntry[] = zip.findEntries(paths);
 
 entries.forEach(async (e: ZipEntry) => {
   console.log(e.getLocalHeaderSize());
 });
```

> Sample output

Prints `LocalFileHeader` size   


Checks if the entry is a directory - `isDirectory(): boolean` 

``` 
 import { ZipFile, ZipEntry } from 'node-hk-zip';
 import fs from 'fs';
 
 const data: Buffer = fs.readFileSync('..some zip file path'); // IMPORTANT: Usage of sync method for demo purposes only
 
 const zip: ZipFile = new ZipFile(data);
 const paths: string[] = ['__MACOSX/'];
 const entries: ZipEntry[] = zip.findEntries(paths);
 
 entries.forEach(async (e: ZipEntry) => {
   console.log(e.isDirectory());
 });
```

> Sample output

`ture // __MACOSX/' is a directory`

Getter for entry name - `getName(): string` 

``` 
 import { ZipFile, ZipEntry } from 'node-hk-zip';
 import fs from 'fs';
 
 const data: Buffer = fs.readFileSync('..some zip file path'); // IMPORTANT: Usage of sync method for demo purposes only
 
 const zip: ZipFile = new ZipFile(data);
 const paths: string[] = ['test.png'];
 const entries: ZipEntry[] = zip.findEntries(paths);
 
 entries.forEach(async (e: ZipEntry) => {
   console.log(e.getName());
 });
```

> Sample output

Prints `test.png`   

Getter for entry's full path in the zip file - `getPath(): string` 

``` 
 import { ZipFile, ZipEntry } from 'node-hk-zip';
 import fs from 'fs';
 
 const data: Buffer = fs.readFileSync('..some zip file path'); // IMPORTANT: Usage of sync method for demo purposes only
 
 const zip: ZipFile = new ZipFile(data);
 const paths: string[] = ['__MACOSX/._test.png'];
 const entries: ZipEntry[] = zip.findEntries(paths);
 
 entries.forEach(async (e: ZipEntry) => {
   console.log(e.getPath());
 });
```

> Sample output

Prints `__MACOSX/._test.png`   

Describe entry in the zip file - `describe(): IZipEntryDescription` 

``` 
 import { ZipFile, ZipEntry } from 'node-hk-zip';
 import fs from 'fs';
 
 const data: Buffer = fs.readFileSync('..some zip file path'); // IMPORTANT: Usage of sync method for demo purposes only
 
 const zip: ZipFile = new ZipFile(data);
 const paths: string[] = ['test.png'];
 const entries: ZipEntry[] = zip.findEntries(paths);
 
 entries.forEach(async (e: ZipEntry) => {
   console.log(e.describe());
 });
```

> Sample output

```
{ isDirectory: false, name: 'test.png', path: 'test.png' }
```









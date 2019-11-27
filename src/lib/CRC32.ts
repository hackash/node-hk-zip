export default class CRC32 {
  private static createCRCTable(): Array<number> {
    let c;
    let table = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      table[n] = c;
    }
    return table;
  }

  public static calculate(input: Buffer): number {
    const table = CRC32.createCRCTable();
    const buffer = Buffer.alloc(4);
    let crc = 0, off = 0, len = input.length, c1 = ~crc;
    while (--len >= 0) c1 = table[(c1 ^ input[off++]) & 0xff] ^ (c1 >>> 8);
    crc = ~c1;
    buffer.writeInt32LE(crc & 0xffffffff, 0);
    // return buffer.readUInt32LE(0);
    /* TODO return calculated CRC */
    return 0;
  };
}

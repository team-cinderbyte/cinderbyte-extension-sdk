const fs = require("fs");

/**
 * Creates a valid 1x1 transparent PNG file.
 */
exports.createDummyPng = (dest) => {
  const pngHex =
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db20000000049454e44ae426082";
  fs.writeFileSync(dest, Buffer.from(pngHex, "hex"));
};

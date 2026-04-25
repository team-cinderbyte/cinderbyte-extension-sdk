import crypto from "crypto";
import fs from "fs";

export function hashFile(path) {
  const buffer = fs.readFileSync(path);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

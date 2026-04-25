import fs from "fs";

export default function () {
  if (fs.existsSync("dist")) {
    fs.rmSync("dist", { recursive: true });
    console.log("dist cleaned");
  }
}

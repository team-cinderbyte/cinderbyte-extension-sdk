import { packExtension } from "../../core/packer.js";

export default async function (args) {
  const dir = args[0];
  if (!dir) {
    console.error("Provide extension path");
    process.exit(1);
  }

  await packExtension(dir);
}

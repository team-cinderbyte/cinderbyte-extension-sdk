import fs from "fs";
import path from "path";
import { packExtension } from "./packer.js";
import { transformManifest } from "./manifest.js";

export async function buildAll() {
  const EXT_DIR = "extensions";
  const OUT_DIR = "dist";

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const repo = {
    repo: JSON.parse(fs.readFileSync("repo.config.json")),
    extensions: [],
  };

  const dirs = fs.readdirSync(EXT_DIR);

  for (const dir of dirs) {
    const full = path.join(EXT_DIR, dir);
    if (!fs.statSync(full).isDirectory()) continue;

    console.log("Building:", dir);

    const { manifest, file } = await packExtension(full);

    fs.renameSync(file, path.join(OUT_DIR, file));

    repo.extensions.push(transformManifest(manifest));
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "repo.json"),
    JSON.stringify(repo, null, 2),
  );

  console.log("Build complete.");
}

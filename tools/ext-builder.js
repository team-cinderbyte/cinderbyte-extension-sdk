#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { transformManifest } from "./manifest-handler.js";

const EXT_DIR = "extensions";
const OUT_DIR = "dist";

const repoConfig = JSON.parse(fs.readFileSync("repo.config.json"));

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR);
}

const repo = {
  repo: repoConfig,
  extensions: [],
};

const dirs = fs.readdirSync(EXT_DIR);

for (const dir of dirs) {
  const fullPath = path.join(EXT_DIR, dir);

  if (!fs.statSync(fullPath).isDirectory()) continue;

  console.log("Building:", dir);

  execSync(`node tools/ext-pack.js ${fullPath}`, {
    stdio: "inherit",
  });

  const manifest = JSON.parse(
    fs.readFileSync(path.join(fullPath, "manifest.json")),
  );

  const fileName = `${manifest.id}-${manifest.version}.ext`;

  fs.renameSync(fileName, path.join(OUT_DIR, fileName));

  const transformed = transformManifest(manifest);

  repo.extensions.push(transformed);
}

// write repo.json
fs.writeFileSync(
  path.join(OUT_DIR, "repo.json"),
  JSON.stringify(repo, null, 2),
);

console.log("Repo built successfully.");

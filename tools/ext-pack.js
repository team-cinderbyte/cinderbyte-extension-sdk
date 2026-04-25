#!/usr/bin/env node
import fs from "fs";
import path from "path";
import esbuild from "esbuild";
import archiver from "archiver";

const dir = process.argv[2];

const manifest = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json")));

// build
await esbuild.build({
  entryPoints: [path.join(dir, manifest.entry)],
  bundle: true,
  outfile: path.join(dir, "dist/main.js"),
  platform: "browser",
  target: "es2020",
});

// runtime manifest
fs.writeFileSync(
  path.join(dir, "dist/manifest.json"),
  JSON.stringify({
    id: manifest.id,
    version: manifest.version,
    entry: "main.js",
  }),
);

// pack
const outName = `${manifest.id}-${manifest.version}.ext`;
const output = fs.createWriteStream(outName);
const archive = archiver("zip");

archive.pipe(output);
archive.directory(path.join(dir, "dist/"), false);

await archive.finalize();

console.log("Built:", outName);

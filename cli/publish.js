#!/usr/bin/env node
import fs from "fs";

const manifest = JSON.parse(fs.readFileSync("manifest.json"));

const repoPath = "../repo.json";

let repo = { extensions: [] };

if (fs.existsSync(repoPath)) {
  repo = JSON.parse(fs.readFileSync(repoPath));
}

repo.extensions.push({
  id: manifest.id,
  name: manifest.name,
  version: manifest.version,
  entry: "main.js",
  archive: {
    url: `https://yourcdn.com/${manifest.id}-${manifest.version}.ext`,
  },
});

fs.writeFileSync(repoPath, JSON.stringify(repo, null, 2));

console.log("Published to repo.json");

import fs from "fs";
import path from "path";
import esbuild from "esbuild";
import archiver from "archiver";

export async function packExtension(dir) {
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json")));

  const distDir = path.join(dir, "dist");
  fs.mkdirSync(distDir, { recursive: true });

  await esbuild.build({
    entryPoints: [path.join(dir, manifest.entry)],
    bundle: true,
    outfile: path.join(distDir, "main.js"),
    platform: "browser",
  });

  fs.writeFileSync(
    path.join(distDir, "manifest.json"),
    JSON.stringify({
      id: manifest.id,
      version: manifest.version,
      entry: "main.js",
    }),
  );

  const outName = `${manifest.id}-${manifest.version}.ext`;

  const output = fs.createWriteStream(outName);
  const archive = archiver("zip");

  archive.pipe(output);
  archive.directory(distDir, false);

  await archive.finalize();

  return { manifest, file: outName };
}

import fs from "fs";
import path from "path";
import esbuild from "esbuild";
import archiver from "archiver";

export async function packExtension(dir) {
  try {
    const manifestPath = path.join(dir, "manifest.json");

    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Missing manifest.json in ${dir}`);
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    const distDir = path.join(dir, "dist");

    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    await esbuild.build({
      entryPoints: [path.join(dir, manifest.entry)],
      bundle: true,
      platform: "browser",
      target: "es2020",
      minify: true,
      sourcemap: false,
      outfile: path.join(distDir, "main.js"),
    });

    fs.writeFileSync(
      path.join(distDir, "manifest.json"),
      JSON.stringify(
        {
          id: manifest.id,
          version: manifest.version,
          entry: "main.js",
        },
        null,
        2,
      ),
    );

    const outName = `${manifest.id}-${manifest.version}.ext`;

    const output = fs.createWriteStream(outName);
    const archive = archiver("zip");

    archive.pipe(output);
    archive.directory(distDir, false);

    await archive.finalize();

    return { manifest, file: outName };
  } catch (err) {
    console.error("❌ Pack failed:", err.message);
    process.exit(1);
  }
}

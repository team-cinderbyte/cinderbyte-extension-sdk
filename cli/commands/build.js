const fs = require("fs");
const path = require("path");
const { pack } = require("../../core/packer");
const { generateRepoIndex } = require("../../core/manifest-handler");

module.exports = async () => {
  const root = process.cwd();
  const extensionsDir = path.join(root, "extensions");
  const dist = path.join(root, "dist");

  if (!fs.existsSync(extensionsDir))
    throw new Error("No /extensions folder found.");
  if (!fs.existsSync(dist)) fs.mkdirSync(dist);

  const folders = fs
    .readdirSync(extensionsDir)
    .map((f) => path.join(extensionsDir, f))
    .filter(
      (f) =>
        fs.statSync(f).isDirectory() &&
        fs.existsSync(path.join(f, "manifest.json")),
    );

  console.log(`🚀 Building Repository...`);

  for (const folder of folders) {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(folder, "manifest.json"), "utf8"),
    );
    const fileName = `${manifest.id}-${manifest.version}.cbe`;

    await pack(folder, path.join(dist, fileName));
    console.log(`   ✅ Packed: ${fileName}`);
  }

  generateRepoIndex(root, dist);
  console.log(`\n🎉 Build Finished!`);
};

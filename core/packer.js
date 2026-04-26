const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

/**
 * The Packer Engine
 * @param {string} sourceDir - The path to the extension folder (containing main.js, etc.)
 * @param {string} outputPath - The destination path for the .cbe file
 */
exports.pack = (sourceDir, outputPath) => {
  return new Promise((resolve, reject) => {
    // Create a file to stream archive data to.
    const output = fs.createWriteStream(outputPath);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression
    });

    // Listen for all archive data to be written
    output.on("close", () => {
      // console.log(`Finished packing: ${archive.pointer()} total bytes`);
      resolve();
    });

    archive.on("warning", (err) => {
      if (err.code === "ENOENT") console.warn("⚠️ Warning:", err);
      else reject(err);
    });

    archive.on("error", (err) => {
      reject(err);
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // 1. Pack User Files
    // We look specifically for the files required by the Cinderbyte spec
    const requiredFiles = ["main.js", "manifest.json", "logo.png"];

    requiredFiles.forEach((fileName) => {
      const filePath = path.join(sourceDir, fileName);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: fileName });
      }
    });

    // 2. Inject the Sidecar Runtime (host.js)
    // This is what Flutter actually executes. It's stored in /runtime/host.js
    const hostTemplatePath = path.join(__dirname, "../runtime/host.js");

    if (fs.existsSync(hostTemplatePath)) {
      archive.file(hostTemplatePath, { name: "host.js" });
    } else {
      reject(
        new Error(
          "Critical Error: Sidecar Host template (runtime/host.js) is missing.",
        ),
      );
    }

    // Finalize the archive (this is async)
    archive.finalize();
  });
};

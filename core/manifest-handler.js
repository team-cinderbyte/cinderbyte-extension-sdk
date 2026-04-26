const fs = require("fs");
const path = require("path");

exports.generateRepoIndex = (root, dist) => {
  const configRaw = JSON.parse(
    fs.readFileSync(path.join(root, "repo.config.json"), "utf8"),
  );
  const extensionsDir = path.join(root, "extensions");

  // Support both {repo: {}} and flat {} formats
  const repoInfo = configRaw.repo || configRaw;

  const extensions = fs
    .readdirSync(extensionsDir)
    .map((f) => path.join(extensionsDir, f))
    .filter(
      (f) =>
        fs.statSync(f).isDirectory() &&
        fs.existsSync(path.join(f, "manifest.json")),
    )
    .map((folder) => {
      const m = JSON.parse(
        fs.readFileSync(path.join(folder, "manifest.json"), "utf8"),
      );
      return { ...m, path: `${m.id}-${m.version}.cbe` };
    });

  fs.writeFileSync(
    path.join(dist, "repo.json"),
    JSON.stringify({ repo: repoInfo, extensions }, null, 4),
  );
};

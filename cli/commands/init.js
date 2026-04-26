const fs = require("fs");
const path = require("path");
const readline = require("readline/promises");
const { createDummyPng } = require("../../utils/fs");

module.exports = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\n--- 🛠️  Cinderbyte Extension Setup Wizard ---\n");

  try {
    const root = process.cwd();
    const repoConfigPath = path.join(root, "repo.config.json");

    // 1. Repo Setup (Only if missing)
    if (!fs.existsSync(repoConfigPath)) {
      console.log("📦 No repository found. Let's create one first.");
      const repoName =
        (await rl.question("Repository Name: ")) || "My Extensions";
      const repoAuthor = (await rl.question("Repository Author: ")) || "Dev";
      const repoVersion =
        (await rl.question("Repository Version (1.0.0): ")) || "1.0.0";

      fs.writeFileSync(
        repoConfigPath,
        JSON.stringify(
          {
            repo: { name: repoName, author: repoAuthor, version: repoVersion },
          },
          null,
          4,
        ),
      );
      console.log("✅ repo.config.json created.\n");
    }

    // 2. Extension Setup
    console.log("🧩 Creating a new Extension...");
    const extId = await rl.question(
      "Extension ID (slug-case, e.g. mangadex): ",
    );
    const extName = await rl.question("Display Name (e.g. MangaDex): ");
    const extAuthor = await rl.question("Author: ");
    const extVersion = (await rl.question("Version (0.0.1): ")) || "0.0.1";
    const extType = (await rl.question("Type (manga/anime): ")) || "manga";
    const extLangs =
      (await rl.question("Languages (comma separated, e.g. en,es): ")) || "en";

    const targetDir = path.join(root, "extensions", extId);
    if (fs.existsSync(targetDir))
      throw new Error(`Extension "${extId}" already exists!`);

    // 3. Confirmation
    console.log(`
Summary:
- ID: ${extId}
- Name: ${extName}
- Type: ${extType}
- Path: /extensions/${extId}
        `);

    const confirm = await rl.question("Proceed? (y/n): ");
    if (confirm.toLowerCase() !== "y") {
      console.log("❌ Aborted.");
      return;
    }

    // 4. File Generation
    fs.mkdirSync(targetDir, { recursive: true });

    const manifest = {
      id: extId,
      name: extName,
      version: extVersion,
      type: extType,
      author: extAuthor,
      entry: "main.js",
      sourceLogo: "logo.png",
      lang: extLangs.split(",").map((l) => l.trim()),
      features: {},
    };

    fs.writeFileSync(
      path.join(targetDir, "manifest.json"),
      JSON.stringify(manifest, null, 4),
    );
    fs.writeFileSync(
      path.join(targetDir, "main.js"),
      `// ${extName} Extension\n\nasync function search(q) {\n    return Cbe.mapResults([]);\n}\n\nasync function getDetails(id) {\n    return { id, title: "${extName}" };\n}`,
    );

    createDummyPng(path.join(targetDir, "logo.png"));

    console.log(`\n✨ Successfully created ${extName}!`);
  } finally {
    rl.close();
  }
};

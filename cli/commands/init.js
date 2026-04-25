import fs from "fs";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((res) => rl.question(q, res));

export default async function () {
  try {
    console.log("\n🧩 Cinderbyte Repo Setup Wizard\n");

    const name = await ask("Repo name: ");
    const author = await ask("Author: ");
    const description = await ask("Description: ");
    const version = await ask("Version (1.0.0): ");

    // ensure structure
    const root = process.cwd();
    const extDir = path.join(root, "extensions");

    if (!fs.existsSync(extDir)) {
      fs.mkdirSync(extDir, { recursive: true });
      console.log("📁 Created extensions/ folder");
    }

    const repoConfigPath = path.join(root, "repo.config.json");

    fs.writeFileSync(
      repoConfigPath,
      JSON.stringify(
        {
          name: name || "Cinderbyte Repo",
          author: author || "unknown",
          description: description || "",
          version: version || "1.0.0",
        },
        null,
        2,
      ),
    );

    console.log("\n✅ Repo initialized successfully");
    console.log("👉 Next: cbe create <extension>");

    rl.close();
  } catch (err) {
    console.error("❌ Setup failed:", err.message);
    rl.close();
    process.exit(1);
  }
}

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
    console.log("\n🧩 Create New Extension\n");

    const id = await ask("Extension ID: ");
    const name = await ask("Name: ");
    const type = await ask("Type (manga/anime/etc): ");
    const version = await ask("Version (1.0.0): ");
    const entry = await ask("Entry file (src/index.ts): ");

    const root = process.cwd();
    const target = path.join(root, "extensions", id);

    if (fs.existsSync(target)) {
      throw new Error("Extension already exists");
    }

    // structure
    fs.mkdirSync(path.join(target, "src"), { recursive: true });
    fs.mkdirSync(path.join(target, "tests"), { recursive: true });

    // manifest
    fs.writeFileSync(
      path.join(target, "manifest.json"),
      JSON.stringify(
        {
          id,
          name,
          version: version || "1.0.0",
          type,
          entry: entry || "src/index.ts",
          author: "",
          description: "",
          lang: ["en"],
          features: {},
        },
        null,
        2,
      ),
    );

    // default source
    fs.writeFileSync(
      path.join(target, "src/index.ts"),
      `export async function search(query: string) {
  return [];
}

export async function getDetails(id: string) {
  return null;
}
`,
    );

    // default test file
    fs.writeFileSync(
      path.join(target, "tests/extension.test.js"),
      `export default {
  async search(api) {
    const res = await api.search("test");
    if (!Array.isArray(res)) {
      throw new Error("search must return array");
    }
  }
};
`,
    );

    console.log("\n✅ Extension created:");
    console.log(`📦 ${target}`);

    rl.close();
  } catch (err) {
    console.error("❌ Create failed:", err.message);
    rl.close();
    process.exit(1);
  }
}

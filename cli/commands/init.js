import fs from "fs";
import path from "path";

export default function () {
  const target = path.join(process.cwd(), "extensions/my-extension");

  fs.mkdirSync(target, { recursive: true });
  fs.mkdirSync(path.join(target, "src"));

  fs.writeFileSync(
    path.join(target, "manifest.json"),
    JSON.stringify(
      {
        id: "my-extension",
        name: "My Extension",
        version: "1.0.0",
        type: "manga",
        entry: "src/index.ts",
      },
      null,
      2,
    ),
  );

  fs.writeFileSync(
    path.join(target, "src/index.ts"),
    `export async function search(query: string) {
  return [];
}`,
  );

  console.log("Extension created at extensions/my-extension");
}

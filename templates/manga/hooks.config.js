import fs from "fs";

export async function runHook(name, context) {
  const hooksPath = "./hooks.config.js";

  if (!fs.existsSync(hooksPath)) return;

  const hooks = await import(process.cwd() + "/hooks.config.js");

  if (hooks[name]) {
    await hooks[name](context);
  }
}

#!/usr/bin/env node

const [, , command, ...args] = process.argv;

switch (command) {
  case "init":
    await import("./commands/init.js").then((m) => m.default(args));
    break;

  case "build":
    await import("./commands/build.js").then((m) => m.default());
    break;

  case "pack":
    await import("./commands/pack.js").then((m) => m.default(args));
    break;

  case "clean":
    await import("./commands/clean.js").then((m) => m.default());
    break;

  default:
    console.log(`
Cinderbyte CLI

Commands:
  cbe init           Create extension template
  cbe build          Build all extensions
  cbe pack <path>    Build single extension
  cbe clean          Clean dist folder
`);
}

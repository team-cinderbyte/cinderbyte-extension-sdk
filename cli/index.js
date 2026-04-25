#!/usr/bin/env node

const [, , command, ...args] = process.argv;

switch (command) {
  case "init":
    (await import("./commands/init.js")).default();
    break;

  case "create":
    (await import("./commands/create.js")).default();
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

process.on("uncaughtException", (err) => {
  console.error("\n Uncaught Error:");
  console.error(err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("\n Promise Rejection:");
  console.error(err);
  process.exit(1);
});

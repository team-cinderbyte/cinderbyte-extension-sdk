#!/usr/bin/env node
const [, , command, ...args] = process.argv;

const commands = {
  init: () => require("./cli/commands/init")(args[0]),
  build: () => require("./cli/commands/build")(),
  clean: () => require("./cli/commands/clean")(),
};

if (commands[command]) {
  commands[command]().catch((err) =>
    console.error(`\n❌ ERROR: ${err.message}`),
  );
} else {
  console.log("Cinderbyte CLI\nUsage: cbe <init|build|clean>");
}

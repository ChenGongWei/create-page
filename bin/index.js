#!/usr/bin/env node

const { program } = require("commander");

/**
 * 命令行解析
 */
const commanderAction = (command, type, name) => {
  console.log(command, type, name);
};

program
  .version("0.0.1", "-v --version -V")
  .arguments("<command> <type> <name>")
  .action(commanderAction)
  .parse(process.argv);

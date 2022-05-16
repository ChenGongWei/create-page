#!/usr/bin/env node

const color = require('colors-cli');
const { program } = require("commander");
const { verifyCommand, getPages, checkNameExist } = require('./utils');


// 结束 commander
const exitCommander = () => {
    console.error(color.red('命令输入有误，请重新输入'));
    process.exit();
}

// 找不到区块而结束
const exitNoExistName = () => {
    console.log(color.red('找不到区块，请重新输入'));
    program.exit();
}

/**
 * 命令行解析
 */
const commanderAction = async (command, type, name) => {

    // 判断命令行是否符合规范
    if (verifyCommand(command, type) === 'page') {
        // 判断用户输入的 pageName 是否存在
        if (checkNameExist(await getPages(), name)) {
            console.log(`${name} 已经存在，请更换名称！`);
        } else {
            exitNoExistName();
        }
    } else {
        exitCommander();
    }
};

/**
 * commanderjs文档：https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md
 * program 为 commander 的全局对象
 * version 为设置版本
 * arguments 用来指定命令行的参数
 * action 执行命令的方法。输入完命令行后，键入回车键能执行 action 下的方法，并且能够将键入的命令行参数带出来
 */

program
  .version("0.0.5", "-v --version -V")
  .arguments("<command> <type> <name>")
  .action(commanderAction)
  .parse(process.argv);


/**
 *  /usr/bin/env 用来告诉用户到 path 目录下去寻找 node。
 *  #!/usr/bin/env node 可以让系统动态的去查找 node，以解决不同机器不同用户设置不一致问题。
 *  该命令必须放在第一行， 否者不会生效。
 * 
 */

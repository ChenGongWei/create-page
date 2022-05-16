#!/usr/bin/env node

const os = require('os');
const path = require('path');
const color = require('colors-cli');
const { program } = require('commander');
const createFile = require('./utils/createFile');
const { verifyCommand, getPages, checkNameExist, getGitUser, getDate } = require('./utils');

// 路径分隔符
var SEP = path.sep;
var gitUser = getGitUser();
var user = os.userInfo({ encoding: 'utf8' });


// 结束 commander
const exitCommander = () => {
    console.error(color.red('命令输入有误，请重新输入'));
    process.exit();
}

/**
 * 命令行解析
 */
const commanderAction = async (command, filePath, optinos) => {

    /** 地址 */
    let distFilePath = path.join(path.resolve(), filePath);
    /** 返回拓展名 */
    let extName = path.extname(distFilePath);
    /** 文件名 */
    let fileName = filePath.substr(filePath.lastIndexOf(SEP) + 1);
    /** 文件夹名称 */
    let FileName = fileName[0].toLocaleUpperCase() + fileName.substr(1);
    // 如果目标路径不是路径，而是文件名，那么模板路径应该是文件的路径
    if (extName) {
        // 模板路径是文件所在的目录
        distFilePath = distFilePath
            .split(SEP)
            .slice(0, -1)
            .join(SEP);
        extReg = /\.\w+$/gi;
        fileName = fileName.replace(extReg, '');
        FileName = FileName.replace(extReg, '');
    }

    // 判断命令行是否符合规范
    if (verifyCommand(command, filePath)) {
        // 判断用户输入的 pageName 是否存在
        if (checkNameExist(await getPages(distFilePath), fileName)) {
            console.log(color.red(`${fileName} 已经存在，请更换名称！`));
        } else {
            if (!optinos.comment) {
                console.log(color.red('请输入注释，例如：'));
                console.log(color.red(`cgwcli add src/pages/Home -c '这是首页'`));
                process.exit();
            }
            createFile(distFilePath, {
                FileName: FileName,
                author: gitUser || user.username,
                date: getDate(),
                comment: optinos.comment,
            });
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
  .version("1.5.0", "-v --version -V")
  .arguments("<command> <filePath>")
  .option('-c, --comment <commant>', '注释')
  .action(commanderAction)
  .parse(process.argv);


/**
 *  /usr/bin/env 用来告诉用户到 path 目录下去寻找 node。
 *  #!/usr/bin/env node 可以让系统动态的去查找 node，以解决不同机器不同用户设置不一致问题。
 *  该命令必须放在第一行， 否者不会生效。
 * 
 */

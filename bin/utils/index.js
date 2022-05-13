const fs = require('fs');
const { join } = require('path');
const { readdirSync, pathExists } = require('fs-extra');

module.exports = {
    // 判断命令是否为 'add'
    verifyCommand: (command, type) => {
        if (command === 'add' && ['page', 'p'].indexOf(type) !== -1) {
            return 'page';
        }
        return '';
    },
    // 读取 /src/pages 文件夹下的所有文件和文件夹的名称
    getPages: async (path = '../../src/pages') => {

        const exists = await pathExists(join(__dirname, path))
        console.log(join(__dirname, path), 'exists');
        if (!exists) {
            return [];
        }
        
        return readdirSync(join(__dirname, path)).filter((pkg) => {
            return pkg.charAt(0) !== '.';
        });
    },
    // 判断用户输入的 pageName 是否在我们的项目中
    checkNameExist: (list = [], name) => {
        console.log(list, name)
        if (list.indexOf(name) !== -1) {
            return true;
        }
        return false;
    }
};
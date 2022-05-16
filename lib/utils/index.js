var child_process = require('child_process');
const path = require('path');
const { readdirSync, pathExists } = require('fs-extra');
const SEP = path.sep;

function fillZero(num) {
    if (num < 10) {
        return '0' + num;
    }
    return num;
}

/** 格式化日期 */
function dateFormat(date) {
    var year = date.getFullYear();
    var month = fillZero(date.getMonth() + 1);
    var day = fillZero(date.getDate());
    var hour = fillZero(date.getHours());
    var min = fillZero(date.getMinutes());
    var sec = fillZero(date.getSeconds());
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}

module.exports = {
    // 判断命令是否为 'add'
    verifyCommand: (command) => {
        if (command === 'add') {
            return true;
        }
        return false;
    },
    // 读取 /src/pages 文件夹下的所有文件和文件夹的名称
    getPages: async (paths = '') => {
        const distFilePath = paths
            .split(SEP)
            .slice(0, -1)
            .join(SEP);
        // const filePath = path.join(path.resolve(), paths);
        const exists = await pathExists(distFilePath);
        if (!exists) {
            return [];
        }
        
        return readdirSync(distFilePath).filter((pkg) => {
            return pkg.charAt(0) !== '.';
        });
    },
    // 判断用户输入的 pageName 是否在我们的项目中
    checkNameExist: (list = [], name) => {
        if (list.indexOf(name) !== -1) {
            return true;
        }
        return false;
    },
    /**
     * 获取git用户名
     */
    getGitUser: () => {
        var name = '';
        var email = '';
        try {
            name = child_process.execSync('git config --get user.name', {
                encoding: 'utf8'
            });
            email = child_process.execSync('git config --get user.email', {
                encoding: 'utf8'
            });
        }
        catch (e) {
            console.error(e);
        }
        name = name && JSON.stringify(name.toString().trim()).slice(1, -1);
        email = email && ' ' + email.toString().trim() + '';
        return (name || '') + (email || '');
    },
    getDate: () => {
        return dateFormat(new Date());
    }
};
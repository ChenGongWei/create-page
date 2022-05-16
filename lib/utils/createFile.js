var fs = require('fs-extra');
const path = require('path');
const color = require('colors-cli');
const mustache = require('mustache');

/** 默认配置 */
const defaultConfig = {
    /** 模板地址 */
    tplPath: path.join(__dirname, '../../tpl'),
    mustache: {
        view: function (data) {
            return data;
        }
    }
};

/**
 * 获取指定目录下的所有文件相对路径
 *
 * @param dir {String} 目录路径
 * @param parentPath {String} 父级相对路径
 * @returns {String[]} 所有文件相对路径
 */
 function readdir(dir, parentPath) {
    var getPath = function (fileName) { return path.join(dir, fileName); };
    var filePaths = [];
    var currentPathDirents = fs.readdirSync(dir, {
        withFileTypes: true
    });
    var i = 0;
    while (i < currentPathDirents.length) {
        var dirent = currentPathDirents[i];
        var completePath = path.join(parentPath, dirent.name);
        if (dirent.isDirectory()) {
            var childFiles = readdir(getPath(dirent.name), completePath);
            childFiles.forEach(function (p) { return filePaths.push(p); });
        }
        else {
            filePaths.push(completePath);
        }
        i++;
    }
    return filePaths;
}

/** 根据文件夹地址和文件名生成对应文件 */
module.exports = function (distFilePath, dataView) {
    var allFiles = readdir(defaultConfig.tplPath, '');

    allFiles.forEach(function (filename) {
        /** 读取模板内容 */
        var template = fs.readFileSync(path.join(defaultConfig.tplPath, filename), 'utf8');
        /** 通过 mustache 对模板内容进行处理 */
        var content = mustache.render(template, dataView);
        /** 读取文件名 */
        var distFileName = mustache.render(filename, dataView)
            .replace(/\.txt$/, '');
        /** 获取文件路径 */
        var filePath = path.join(distFilePath, distFileName);
        console.log(color.green(`write file: ${filePath}`));
        /** 写入文件 */
        fs.outputFile(filePath, content, 'utf8');
    });
}
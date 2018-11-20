const util = require('./utils');
const path = require('path');
const log = console.log;
const chalk = require('chalk');


function generateFile(type, fileName) {
    fileName = typeof fileName == 'string' ? fileName:'';
    console.log(type,fileName);
    let readFileName = path.resolve(__dirname, './templates/index.vue');
    let writeFileName = fileName ? path.resolve(__dirname, fileName) : path.resolve(__dirname, 'index.vue');
    if (type == 'vue') {
        readFileName = path.resolve(__dirname, './templates/index.vue');
        writeFileName = fileName ? path.resolve(__dirname, fileName) : path.resolve(__dirname, 'index.vue');
    } else if (type == 'store') {
        readFileName = path.resolve(__dirname, './templates/store.js');
        writeFileName = fileName ? path.resolve(__dirname, fileName) : path.resolve(__dirname, 'store.js');
    } else if (type == 'eslint') {
        readFileName = path.resolve(__dirname, './templates/eslint.js');
        writeFileName = path.resolve(__dirname, './.eslint.js');
    }else if (type == 'editconfig'){
        readFileName = path.resolve(__dirname, './templates/editConfig.txt');
        writeFileName = path.resolve(__dirname, './.editconfig');
    }

    // console.log(type,fileName);


    util.file.readFile(readFileName).then(data => {
        return {writeFileName, data}
    }).then(({writeFileName, data}) => {
        return util.file.writeFile(writeFileName, data)
    }).then(() => {
        log(chalk.green(`生成${type} 类型文件成功！`));
    }).catch(e => {
        log(chalk.red('生成失败'), e);
    })

}

module.exports = {
    generateFile
};
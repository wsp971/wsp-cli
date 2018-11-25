const gulp = require('gulp');
const sftp = require('gulp-sftp');
const path = require('path');
const fs = require('fs');

const util = require('../utils');
const inquirer = require('inquirer');
const chalk = require('chalk');
const log = console.log;

const sftpConfigFilePath = path.join(process.cwd(), 'sftp.json');


function run() {
    if (fs.existsSync(sftpConfigFilePath)) {
        util.file.readFile(sftpConfigFilePath).then(data => {
            const config = JSON.parse(data);
            upload(config);
        })
    } else {
        log(chalk.red('当前目录没有检查到sftp.json文件！'));
        const questions = [{
            type: 'input',
            name: 'host',
            message: '请输入所要上传的服务器ip',
            validate(input){
                return /(\d{1,3}\.){3}\d{1,3}/.test(input)
            }
        }, {
            type: 'input',
            name: "user",
            message: '请输入用户名：'
        },
        {
            type: 'password',
            name: "pass",
            message: '请输入服务器密码:'
        },
        {
            type: "input",
            name: 'remotePath',
            message: '请输入上传的服务器路径',
            validate(input){
                return /^\/(\w+\/)*$/.test(input)
            }
        }];

        inquirer.prompt(questions).then( answer => {
            console.log(answer);
            const writeStream = util.file.createWriteSterem(sftpConfigFilePath);
            writeStream.write(JSON.stringify(answer));
            writeStream.end();
            upload(answer);
        })
    }
}


function upload(config){
    const currentPath = process.cwd();
    const sftpPath = [`${currentPath}/**/*`,'!node_modules/**/*','!sftp.json'];
    gulp.src(sftpPath).pipe(sftp(config));
}


module.exports = {
    run
};



#!/usr/bin/env node
var program = require('commander');
var package = require('./package.json');
var chalk = require('chalk');
var log = console.log;
var todo = require('./functions/todo');
var wordManager = require('./functions/word');
var sftp = require('./functions/sftp');
var {generateFile} = require('./functions/generateFile');

/**
 * 單詞管理命令
 * */
program.command('word')
    .description('单词复习计划')
    .usage('word [options]')
    .alias('w')
    .option('-w --whole', 'show all word list of yours')
    .option('-l --list', 'show the word list which of you have not recited')
    .option('-a --add', 'add a word to you words list')
    .option('-c --change', 'change the state of word which you should recite or not')
    .option('-d --delete', 'delete a word from your word list')
    .option('-r --review', 'review your word list')
    .action(function (word, interpretation, cmd) {
        if (word.whole) {
            wordManager.words.showAllwords();
            return;
        }
        if (word.list) {
            wordManager.words.showTheNotKnowWord();
            return;
        }
        if(word.review){
            wordManager.review();
            return;
        }
        if (word.add || (interpretation && interpretation.add) || (cmd && cmd.add)) {
            if (!word || !interpretation) {
                log(chalk.red('Error: add a word like this:'));
                log(chalk.green('wsp word -a test 测试'));
            } else {
                wordManager.add(word, interpretation);
            }
            return;
        }
        if (word.change || (interpretation && interpretation.change) || (cmd && cmd.change)) {
            if (!word) {
                log(chalk.red('Error: change a word like this:'));
                log(chalk.yellow('wsp word -c test'));
            } else {
                wordManager.words.changeWorld(word);
            }
            return;
        }

        if (word.delete || (interpretation && interpretation.delete)) {
            if (!word) {
                log(chalk.red('Error: delete a word like this:'));
                log(chalk.yellow('wsp word -d test'));
            } else {
                wordManager.words.deleteWord(word);
            }
            return;
        }
        log("");
        log(chalk.bgWhite.yellow("Examples:"));
        log("");
        log(chalk.blue(' wsp word --list'));
        log(chalk.blue(' wsp word --review'));
        log(chalk.blue(' wsp word --add test 测试'));
        log(chalk.blue(' wsp word --whole'));
        log(chalk.blue(' wsp word --delete'));
        log(chalk.blue(' wsp word --change test'));
    })
    .on('--help', function () {
        log("");
        log(chalk.bgWhite.yellow("Examples:"));
        log("");
        log(chalk.blue(' wsp word --list'));
        log(chalk.blue(' wsp word --review'));
        log(chalk.blue(' wsp word --add test 测试'));
        log(chalk.blue(' wsp word --whole'));
        log(chalk.blue(' wsp word --delete'));
        log(chalk.blue(' wsp word --change test'));
    });



/** todo list 管理*/
program.command('todo')
    .description('待做事项列表')
    .alias('td')
    .usage('todo [options] [arg]')
    .option('-l --list', 'show the list you should todo next time')
    .option('-a --add', 'add todo item of your todo list')
    .option('-d --delete', 'delete the todo item')
    .action(function (cmd) {
        if (cmd.list) {
            todo.todoList.showNotFinishedList();
        }
        if (cmd.add) {
            todo.addTodoItem();
        }
        if(cmd.delete){
            todo.todoList.deleteItem();
        }
    })
    .on('--help', function () {
        console.log("");
        console.log("Examples:");
        console.log("");
        console.log(' wsp todo --list');
        console.log(' wsp todo --add');
        console.log(' wsp todo --delete');
    });


program.command('sftp')
    .description('上传文档到服务器')
    .usage('sftp <file> [option]')
    .alias('s')
    .action(function () {
        sftp.run();
    })
    .on('--help', function(){
        console.log("");
        console.log("Examples:");
        console.log("");
        console.log(' wsp sftp');
    });


/** 生成模板文件*/
program.command('generate')
    .description('创建模板文件')
    .usage('template [option] <filename>')
    .alias('g')
    .option('-v --vue', 'generate a vue template file')
    .option('-s --store', 'generate a vuex store template file')
    .option('-e --eslint', 'generate a eslint template file')
    .option('-d --editconfig','generate a .editconfig template file')
    .action(function (filename, cmd) {
        if (filename.vue || (cmd && cmd.vue)) {
            generateFile('vue', filename);
        }
        if (filename.store || (cmd && cmd.store)) {
            generateFile('store', filename)
        }
        if (filename.eslint || (cmd && cmd.eslint)) {
            generateFile('eslint')
        }
        if(filename.editconfig || (cmd && cmd.editconfig)){
            generateFile('editconfig');
        }

    })
    .on('--help', function () {
        console.log("");
        console.log("Examples:");
        console.log("");
        console.log(' wsp template --vue test.vue');
        console.log(' wsp template --store test.store');
        console.log(' wsp template --eslint');
        console.log(' wsp template --editconfig');
    });


if (!process.argv.slice(2).length) {
    program.outputHelp(make_red);
}

function make_red(txt) {
    return chalk.red(txt)
}

program.version(package.version).parse(process.argv);



#!/usr/bin/env node
var program = require('commander');
var package = require('./package.json');
var chalk = require('chalk');
var log = console.log
var todoList = require('./todo').todoList;
var wordManager = require('./word');
var {generateFile} = require('./generateFile');

/**
 * 單詞管理命令
 * */
program.command('word')
    .description('单词复习计划')
    .usage('word [options]')
    .option('-w --whole', 'show all word list of yours')
    .option('-l --list', 'show the word list which of you have not recited')
    .option('-a --add', 'add a word to you words list')
    .option('-c --change', 'change the state of word which you should recite or not')
    .option('-d --delete', 'delete a word from your word list')
    .action(function (word, interpretation, cmd) {
        if (word.whole) {
            wordManager.words.showAllwords();
            return;
        }
        if (word.list) {
            wordManager.words.showTheNotKnowWord();
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
        log(chalk.blue(' $ word --list'));
        log(chalk.blue(' $ word --add test 测试'));
        log(chalk.blue(' $ word --whole'));
        log(chalk.blue(' $ word --delete'));
        log(chalk.blue(' $ word --change test'));
    })
    .on('--help', function () {
        log("");
        log(chalk.bgWhite.yellow("Examples:"));
        log("");
        log(chalk.blue(' $ word --list'));
        log(chalk.blue(' $ word --add test 测试'));
        log(chalk.blue(' $ word --whole'));
        log(chalk.blue(' $ word --delete'));
        log(chalk.blue(' $ word --change test'));
    });




program.command('todo')
    .description('待做事项列表')
    .alias('td')
    .usage('todo [options] [arg]')
    .option('-l --list', 'show the list you should todo next time')
    .option('-a --add', 'add todo item of your todo list')
    .action(function (cmd) {
        if (cmd.list) {
            todoList.showNotFinishedList();
        }
        if (cmd.add) {
            var addTestItem = require('./todo').addTextAtem
            addTestItem();
            todoList.saveToStore();
        }
    })
    .on('--help', function () {
        console.log("");
        console.log("Examples:");
        console.log("");
        console.log(' $ todo --list');
        console.log(' $ todo --add');
    });


program.command('upload')
    .description('上传文档到服务器')
    .usage('upload <file> [option]')
    .alias('u')
    .action(function () {
        console.log('hello this is the upload subcommand');
    });

program.command('generate')
    .description('创建模板文件')
    .usage('template [option] <filename>')
    .alias('t')
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
        console.log(' $ template --vue test.vue');
        console.log(' $ template --store test.store');
        console.log(' $ template --eslint');
        console.log(' $ template --editconfig');
    });


if (!process.argv.slice(2).length) {
    program.outputHelp(make_red);
}

function make_red(txt) {
    return chalk.red(txt)
}







/***********************以下是官方示例********************************/

// //例子
// program
//     .command('exec <cmd>')
//     .alias('ex')
//     .description('execute the given remote cmd')
//     .option("-e, --exec_mode <mode>", "Which exec mode to use")
//     .action(function (cmd, options) {
//         console.log('exec "%s" using %s mode', cmd, options.exec_mode);
//     }).on('--help', function () {
//     console.log('');
//     console.log('Examples:');
//     console.log('');
//     console.log('  $ deploy exec sequential');
//     console.log('  $ deploy exec async');
// });

program.parse(process.argv);
program.version(package.version);
// program.outputHelp(make_red);


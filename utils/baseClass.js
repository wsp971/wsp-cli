const file = require('./file');
const events = require('events');
const log = console.log;
const chalk = require('chalk');
const {table, getBorderCharacters, createStream} = require('table');

class BaseClass extends events {
    constructor(path) {
        super();
        this.path = path;
    }
    //初始化数据
    initilize(cb) {
        file.readFile(this.path).then(res => {
            const data = JSON.parse(res);
            this.data = data;
            this.init = true;
            this.emit('init');
            cb && cb()
        }).catch(e => {
            file.writeFile(this.path, '{}').then(() => {
                this.data = {};
                this.init = true;
                this.emit('init');
            }).catch(err => {
                log(chalk.red(`${this.path} create error`), err)
            });
        })
    }

    /** 封装方法，对所调用方法做判断*/
    ready(fn) {
        if (this.init) {
            fn();
        } else {
            this.on('init', () => {
                fn();
            })
        }
    }

    /** 展示列表方法*/
    showTable(tableData, color = 'blue') {
        const printTable = [];
        if (tableData[0]) {
            Object.keys(tableData[0]).forEach((key) => {
                printTable[0] = printTable[0] || [];
                printTable[0].push(key);
                tableData.forEach((todoItem, todoIndex) => {
                    printTable[todoIndex + 1] = printTable[todoIndex + 1] || [];
                    printTable[todoIndex + 1].push(todoItem[key]);
                })
            });
            const tableConfig = {border: getBorderCharacters('honeywell')};
            log(chalk[color](table(printTable, tableConfig)));
        } else {
            createStream({
                columnDefault: {
                    width: 50
                },
                columnCount: 1
            }).write([chalk.red('list empty!')]);
        }
    }

    saveToFile(data = this.data, cb) {
        this.saving = true;
        if (this.saving) {
            clearTimeout(this.saveTimeStr);
            this.saveTimeStr = null;
        }
        this.saveTimeStr = setTimeout(() => {
            file.writeFile(this.path, JSON.stringify(data)).then(res => {
                log(chalk.green('save success!'));
                this.saving = false;
                cb && cb();
            }).catch(e => {
                log(chalk.red('save error!'));
                log(chalk.red(e));
            })
        }, 20)
    }
}

module.exports  = BaseClass;
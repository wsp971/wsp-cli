const util = require('./utils');
const path = require('path');
const eventEmitter = require('events');
const {table, getBorderCharacters, createStream} = require('table');
const chalk = require('chalk');
const log = console.log;

const filePath = path.resolve(__dirname, './stores/todoList.json');

class TodoList extends eventEmitter {
    constructor() {
        super();
        this.initilizeTodoList();
    }

    // 增加todo 项
    addTodoItem(todoItem) {
        this.ready(() => {
            this.todoList.push(todoItem);
        });

        return this;
    }

    // 初始化todo list
    async initilizeTodoList() {
        util.file.readFile(filePath).then(data => {
            this.todoList = JSON.parse(data).todoList;
            this.init = true;
            this.emit('init');
        }).catch(e => {
            log(chalk.red('init todoList error'), e);
        })
    }


    /**
     * 保证读文件成功之后再进行数据操作
     * */
    ready(fn) {
        if (this.init) {
            fn()
        } else {
            this.on('init', () => {
                fn();
            })
        }
    }

    /**
     * save you todo list to the store.json file
     *
     * */
    saveToStore() {
        this.ready(() => {
            if (!this.writing) {
                clearTimeout(this.saveTimestr);
                this.saveTimestr = null;
                this.saveTimestr = setTimeout(() => {
                    this.writing = true;
                    util.file.writeFile(filePath, JSON.stringify({todoList: this.todoList})).then(res => {
                        console.log("save success");
                        this.writing = false;
                    }).catch(e => {
                        console.log('save error', e);
                        this.writing = false;
                    })
                }, 20);
            }
        });
    }

    /**
     * remove some todo item
     * */
    removeItem(todoItem) {
        this.ready(() => {
            this.todoList.filter(item => item.key !== todoItem.key)
            this.saveToStore();
        });
    }

    /** 清空 todo list*/
    clear() {
        this.ready(() => {
            this.todoList = [];
            this.saveToStore();
        });
    }


    /**
     *
     * 展示 所有的todo list
     * */
    showAllTodoList() {
        this.ready(() => {
            log(chalk.red('the all todoList are followes:'));
            this.showTable(this.todoList);
        });
    }

    /**
     * 展示还未完成的todo list
     * */
    showNotFinishedList() {
        this.ready(() => {
            log(chalk.red('the next todo list you should  are followes:'));
            this.showTable(this.todoList.filter(item => !item.isFinished), 'green')
        })
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
            }).write([chalk.red('you do not have todo list items!')]);
        }
    }
}

/**
 * todo 项 类
 * */
class todoItem {
    constructor(option) {
        const today = new Date();
        this.key = [today.getFullYear(), today.getMonth() + 1, today.getDate(), today.getHours(),
            today.getMinutes(), today.getSeconds(), Math.floor(Math.random() * 100 % 100)].join('-');
        this.name = option.name;
        this.isLoop = option.isLoop || false;
        this.isFinished = option.isFinished || false;
        this.frequency = option.frequency;
        this.createTime = [today.getFullYear(), today.getMonth() + 1, today.getDate()].join("/") + ' ' +
            [today.getHours(), today.getMinutes(), today.getSeconds()].join(":");
    }
}


const todoList = new TodoList();

function addTextAtem() {
    const testTodoItem = new todoItem({name: '测试', isLoop: true, frequency: '1week'});
    todoList.addTodoItem(testTodoItem).showAllTodoList();
    todoList.saveToStore();
}


module.exports = {
    todoList,
    addTextAtem
};

// todoList.showAllTodoList();
// const testTodoItem = new todoItem({name: '测试', isLoop: true, frequency: '1week'});
// todoList.addTodoItem(testTodoItem).showAllTodoList();
// todoList.saveToStore();
// todoList.showNotFinishedList();
// todoList.clear();
// todoList.saveToStore();

















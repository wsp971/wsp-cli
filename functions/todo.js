const util = require('../utils');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const os = require('os');
const log = console.log;

const parentPath = os.homedir();
const workSpace = path.join(parentPath, 'wsp-cli');
const filePath = path.resolve(workSpace, 'todoList.json');

class TodoList extends util.baseClass {
    constructor(path) {
        super(path);
        this.initWorkSpace()
            .then(this.initilize.bind(this))
            .catch(e => log(e));
        this.ready(() => {
            this.todoList = this.data.todoList || [];
        })
    }
    // 增加todo 项
    addTodoItem(todoItem) {
        this.ready(() => {
            this.todoList.push(todoItem);
            this.saveToFile({'todoList': this.todoList});
        });
    }

    deleteItem(){
        this.ready(()=>{
            const loopChoice = this.todoList.filter(item => item.isLoop).map(item=>{return {value: item.key,name: item.taskName}});
            const notLoopChoise = this.todoList.filter(item => !item.isLoop).map(item=>{return {value: item.key,name: item.taskName}});
            const choices =[].concat( [new inquirer.Separator('loop items :')], loopChoice,[new inquirer.Separator('not loop items :')],notLoopChoise)
            inquirer.prompt([{
                type: 'checkbox',
                name:'delete_key',
                message:'请选择要删除的item:',
                choices:choices
            }]).then( answer =>{
                this.todoList = this.todoList.filter(todoItem => answer.delete_key.indexOf(todoItem.key) ==-1)
                this.saveToFile({todoList: this.todoList});
            })
        });
    }
    initWorkSpace() {
        return new Promise((resolve, reject) => {
            fs.exists(workSpace, exist => {
                if (exist) {
                    resolve();
                } else {
                    util.file.makeDir(parentPath, 'wsp-cli').then(() => {
                        resolve()
                    }).catch(e => reject(e));
                }
            });
        })
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
            log(chalk.red('周期todo list:'))
            const loopChoice = this.todoList.filter(item => item.isLoop);
            this.showTable(loopChoice);
            log(chalk.red('非周期todo list:'))
            const notLoopChoise = this.todoList.filter(item => !item.isLoop);
            this.showTable(notLoopChoise,'yellow');
        })
    }
}

/**
 * todo 项 类
 * */

class TodoItem {

    constructor(option) {
        this.taskName = option.taskName;
        this.isLoop = option.isLoop || false;
        this.isFinished = option.isFinished || false;
        this.importantLevel = option.importantLevel || 1;
        this.loopType  = option.loopType;
        this.amount = option.amount;

        const today = new Date();
        this.key = [today.getFullYear(), today.getMonth() + 1, today.getDate(), today.getHours(),
            today.getMinutes(), today.getSeconds(), Math.floor(Math.random() * 100 % 100)].join('-');
        this.createTime = [today.getFullYear(), today.getMonth() + 1, today.getDate()].join("/") + ' ' +
            [today.getHours(), today.getMinutes(), today.getSeconds()].join(":");
    }
}
const todoList = new TodoList(filePath);

function addTodoItem() {
    const firstQuestions = [
        {
            type: 'confirm',
            name: 'isLoop',
            default: false,
            message: '是否是周期性任务？'
        }
    ];
    const noLoopQuestions = [
        {
            type: "input",
            name: 'taskName',
            message: "请输入任务名称:"
        },{
            type:"list",
            name:'importantLevel',
            message:'请选择重要程度：',
            choices:[{
               name:"一般",
               value:1
            },{
                name:'重要',
                value:2,
            },{
                name:"非常重要",
                value:3
            },{
                name:'紧急',
                value:4
            }]
        }
    ];
    const loopQuestions = [
        {
            type:'input',
            name:'taskName',
            message:'请输入任务名称？'
        },
        {
            type:"list",
            name:'importantLevel',
            message:'请选择重要程度：',
            choices:[{
                name:"一般",
                value:1
            },{
                name:'重要',
                value:2,
            },{
                name:"非常重要",
                value:3
            },{
                name:'紧急',
                value:4
            }]
        },
        {
            type: 'list',
            name:'loopType',
            message:'请选择任务周期:',
            choices:[
                {
                    name: '日',
                    value: 'day'
                },
                {
                    name: '周',
                    value: 'week'
                },
                {
                    name: '月',
                    value: 'mouth'
                },
                {
                    name:'年',
                    value:'mouth'
                }
            ]
        },
        {
            type:'input',
            name:'amount',
            message:'请输入周期长度（仅支持数字！）:',
            validate(input){
                if(isNaN(parseInt(input))){
                   return false;
                }else{
                    return true;
                }
            }
        }
    ];

    inquirer.prompt(firstQuestions).then(answer => {
        if (answer.isLoop) {
            inquirer.prompt(loopQuestions).then( todoItem =>{
                // console.log(todoItem);
                const item = Object.assign({},answer,todoItem);
                todoList.addTodoItem(new TodoItem(item));
            })

        } else {
            inquirer.prompt(noLoopQuestions).then(todoItem =>{
                const item = Object.assign({},answer,todoItem);
                todoList.addTodoItem(new TodoItem(item));
            })
        }
    });
}

function editTodoItem(key){

    const choices = todoList.todoList.map(item => { return {value: item.key,name: item.taskName}});

    inquirer.prompt([{
        type: 'list',
        name:'key',
        choices:choices
    }]).then( answer =>{
        console.log(answer);
    })
    inquirer.prompt([{
        type:'editor',
        name:'todoItem',
        default: todoItem
    }]).then( result =>{
        console.log(result);
    });
}


module.exports = {
    todoList,
    addTodoItem,
    editTodoItem
};

// todoList.showAllTodoList();
// const testTodoItem = new todoItem({name: '测试', isLoop: true, frequency: '1week'});
// todoList.addTodoItem(testTodoItem).showAllTodoList();
// todoList.saveToStore();
// todoList.showNotFinishedList();
// todoList.clear();
// todoList.saveToStore();

















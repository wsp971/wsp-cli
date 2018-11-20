const path = require('path');
const util = require('./utils');
const filePath = path.resolve(__dirname, './stores/words.json');
const events = require('events');
const {table, getBorderCharacters, createStream} = require('table');
const chalk = require('chalk');
const log = console.log

class BaseClass extends events {
    constructor(path) {
        super();
        this.path = path;
    }
    //初始化数据
    initilize(cb) {
        util.file.readFile(this.path).then(res => {
            const data = JSON.parse(res);
            this.data = data;
            this.emit('init');
            cb && cb()
        }).catch(e => {
            log(chalk.red('error', e));
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

    saveToFile(data, cb) {
        this.saving = true;
        if (this.saving) {
            clearTimeout(this.saveTimeStr);
            this.saveTimeStr = null;
        }
        this.saveTimeStr = setTimeout(() => {
            util.file.writeFile(this.path, JSON.stringify(data)).then(res => {
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


class WordItem {
    constructor(option) {
        this.word = option.word;
        this.interpretation = option.interpretation;
        this.isKnow = option.isKnow || false;
        this.important = option.important || 0;
    }
}

class WordsManager extends BaseClass {
    constructor(path) {
        super(path);
        this.initilize();
        this.ready(() => {
            this.wordList = this.data.wordList;
        })
    }

    addWord(wordItem) {
        this.ready(() => {
            const isExitsword = this.wordList.find(item =>item.word == wordItem.word)
            if(isExitsword){
                isExitsword.important ++;
            }else{
                this.wordList.push(wordItem);
            }
            this.saveToFile({wordList: this.wordList})
        })
    }
    deleteWord(word){
        this.ready(()=>{
            this.wordList = this.wordList.filter(item => item.word !=word);
            this.save();
        })
    }
    save(){
        this.saveToFile({wordList: this.wordList});
    }
    changeWorld(word){
        this.ready(() =>{
           const theWord = this.wordList.find(item => item.word == word);
           if(theWord){
               theWord.isKnow = !theWord.isKnow;
               this.saveToFile({wordList: this.wordList});
           }else{
               console.log(chalk.red(`${word} is not find in the word list`));
           }
        });
    }
    showAllwords() {
        log(chalk.red("the all words are:"))
        this.ready(() => {
            this.showTable(this.wordList)
        })
    }
    showTheNotKnowWord() {
        log(chalk.green('the not know words are:'));
        this.ready(() => {
            this.showTable(this.wordList.filter(item => !item.isKnow).sort((a,b)=> b.important - a.important), 'red');
        })
    }
}

const  words  = new WordsManager(filePath);



function add(word,interpretation){
    log(word,interpretation);
    const newWords = new WordItem({
        word:word,
        interpretation:interpretation
    });
    words.addWord(newWords);
}

module.exports = {
    words,
    add
};

// words.showAllwords();
//
// words.addWord(word);
//
// words.showTheNotKnowWord();




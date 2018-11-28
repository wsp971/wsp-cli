const path = require('path');
const fs = require('fs');
const util = require('../utils');
const os = require('os');
const inquirer = require('inquirer');
const parentPath = os.homedir();
const workSpace = path.join(parentPath, 'wsp-cli');
const filePath = path.resolve(workSpace, 'words.json');
const chalk = require('chalk');
const log = console.log;
const moment = require('moment');

class WordItem {
    constructor(option) {
        this.word = option.word;
        this.interpretation = option.interpretation;
        this.isKnow = option.isKnow || false;
        this.important = option.important || 0;
        this.updateTime = moment().format('YYYY-MM-DD');
    }
}

class WordsManager extends util.baseClass {
    constructor(path) {
        super(path);
        this.initWorkSpace()
            .then(this.initilize.bind(this))
            .catch(e => log(e));
        this.ready(() => {
            this.wordList = this.data.wordList || [];
        })
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

    addWord(wordItem) {
        this.ready(() => {
            const isExit = this.wordList.find(item => item.word == wordItem.word)
            if (isExit) {
                this.addImportant(wordItem);
            } else {
                this.wordList.push(wordItem);
                this.save();
            }
        })
    }

    addImportant(wordItem, isIncreace = true) {
        this.ready(() => {
            const theWord = this.wordList.find(item => item.word == wordItem.word)
            if (theWord) {
                if(isIncreace){
                    ++theWord.important;
                    theWord.updateTime = moment().format('YYYY-MM-DD');
                }else{
                    --theWord.important;
                }
            }
            this.save();
        })
    }

    deleteWord(word) {
        this.ready(() => {
            this.wordList = this.wordList.filter(item => item.word != word);
            this.save();
        })
    }

    save() {
        this.wordList.forEach( item =>{
            if(item.important <= -10){
                item.isKnow = true;
            }else{
                item.isKnow = false;
            }
        });
        this.saveToFile({wordList: this.wordList});
    }

    changeWorld(word) {
        this.ready(() => {
            const theWord = this.wordList.find(item => item.word == word);
            if (theWord) {
                theWord.isKnow = !theWord.isKnow;
                if(theWord.isKnow){
                    theWord.important = -10;
                }else{
                    theWord.important = 0;
                }
                this.save();
            } else {
                console.log(chalk.red(`${word} is not find in the word list`));
            }
        });
    }

    showAllwords() {
        this.ready(() => {
            this.wordList.sort((a,b)=> {
                if(a.word < b.word){
                    return -1;
                }else if(a.word > b.word){
                    return 1;
                }else{
                    return 0;
                }
            });
            log(chalk.red(`总共有${this.wordList.length}个单词:`));
            this.showTable(this.wordList,'blue',['updateTime']);
        })
    }

    queryword(string) {

       const result =  this.wordList.filter(word => word.word.indexOf(string) > -1 || word.interpretation.indexOf(string) > -1)
           .map(item=>{return {word: item.word,interpretation: item.interpretation}});

       this.showTable(result, 'blue', 'updateTime');
    }

    showTheNotKnowWord() {
        this.ready(() => {
            //排序优先顺序  重要性 > 更新日期 > 字母顺序
            const wordList = this.wordList.filter(item => !item.isKnow).sort((a, b) => {
                if (b.important - a.important < 0) {
                    return -1;
                }
                if (b.important - a.important > 0) {
                    return 1;
                }
                if (b.important == a.important) {
                    if (b.updateTime < a.updateTime) {
                        return -1;
                    }
                    if (b.updateTime > a.updateTime) {
                        return 1;
                    }

                    if(a.word < b.word){
                        return-1;
                    }
                    if(a.word > b.word){
                        return -1;
                    }

                    return 0;
                }
            });
            log(chalk.green(`还有${wordList.length}个单词待记忆：`));
            this.showTable(wordList, 'red', 'updateTime');
        })
    }

    queryFinished(){

        const finishedWord = this.wordList.filter(word => word.isKnow).map(word =>{
            return {
                word: word.word,
                interpretation: word.interpretation
            }
        }).sort((a,b)=>{
            if(a.word < b.word){
                return -1;
            }else if(a.word > b.word){
                return 1;
            }else{
                return 0;
            }
        });
        log(chalk(`恭喜主人，已经记住了${finishedWord.length}个单词！`));
        this.showTable(finishedWord, 'blue');
    }
}

const words = new WordsManager(filePath);

function add(word, interpretation) {
    const newWords = new WordItem({
        word: word,
        interpretation: interpretation
    });
    words.addWord(newWords);
}

/**
 *
 * 复习单词
 * */
function review() {
    words.ready(() => {
        const waitReviewWords = words.wordList
            .filter(item => !item.isKnow)
            .map(item => {
                return {word: item.word, interpretation: item.interpretation}
            });

        reviewWord();
        function reviewWord() {
            if (waitReviewWords.length <= 0) {
                log(chalk.green('review completed!'));
                return
            }
            log(`还有${waitReviewWords.length}个待复习单词哦~`);
            const index = util.random(waitReviewWords.length);
            const reviewWord = waitReviewWords.splice(index, 1);
            const word = reviewWord && reviewWord[0];
            if (!word) {
                return;
            }

            inquirer.prompt([{
                type: 'input',
                name: 'interpretation',
                message: `${word.word} 的中文释义是：`,
                validate(input){
                    if(input.trim() == ''){
                        return false;
                    }else{
                        return true;
                    }
                }
            }]).then(answer =>{           /*增加重要程度*/
                if (word.interpretation.indexOf(answer.interpretation) == -1) {
                    words.addImportant(word);
                }else{
                    words.addImportant(word ,false);
                }
                log('');
                words.showTable(reviewWord, 'blue');
                log('');

                setTimeout(()=>{
                    arguments.callee.apply(this, arguments);
                },300)

            })
        }

    });
}



/**
 * 查询单词
 * */

function queryWord(){
    words.ready(()=>{
        inquirer.prompt([{
            type:'input',
            name:'querystring',
            message:'请输入你要查询的单词：',
            validate(input){
                return /\S+/.test(input)
            }
        }]).then(answer =>{
            words.queryword(answer.querystring);
        });
    })
}

/**
 * 查询已会的单词
 * */

function queryFinished(){
    words.ready(()=>{
        words.queryFinished();
    })
}

module.exports = {
    words,
    add,
    review,
    queryWord,
    queryFinished
};





const path = require('path');
const fs = require('fs');
const util = require('../utils');
const os = require('os');

const parentPath = os.homedir();
const workSpace = path.join(parentPath, 'wsp-cli');
const filePath = path.resolve(workSpace, 'words.json');
const chalk = require('chalk');
const log = console.log;

class WordItem {
    constructor(option) {
        this.word = option.word;
        this.interpretation = option.interpretation;
        this.isKnow = option.isKnow || false;
        this.important = option.important || 0;
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
            const isExitsword = this.wordList.find(item => item.word == wordItem.word)
            if (isExitsword) {
                isExitsword.important++;
            } else {
                this.wordList.push(wordItem);
            }
            this.saveToFile({wordList: this.wordList})
        })
    }

    deleteWord(word) {
        this.ready(() => {
            this.wordList = this.wordList.filter(item => item.word != word);
            this.save();
        })
    }

    save() {
        this.saveToFile({wordList: this.wordList});
    }

    changeWorld(word) {
        this.ready(() => {
            const theWord = this.wordList.find(item => item.word == word);
            if (theWord) {
                theWord.isKnow = !theWord.isKnow;
                this.saveToFile({wordList: this.wordList});
            } else {
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
            this.showTable(this.wordList.filter(item => !item.isKnow).sort((a, b) => b.important - a.important), 'red');
        })
    }
}

const words = new WordsManager(filePath);


function add(word, interpretation) {
    log(word, interpretation);
    const newWords = new WordItem({
        word: word,
        interpretation: interpretation
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




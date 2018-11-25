const file = require('./file');
const baseClass = require('./baseClass');

module.exports =  {
    file,
    baseClass,
    random
};


/**
 *  随机产生一个 len 以内的 整数
 * */
function random(maxNum){
    return Math.floor(Math.random() * maxNum);
}
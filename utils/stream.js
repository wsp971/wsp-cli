const fs = require('fs');
const file = require('./file');
const path = require('path');

/**
 *  创建 */

var writeStream = file.createWriteSterem(path.resolve(__dirname, '../love2.txt'));
var readStream = file.createReadStream(path.resolve(__dirname,'../love.txt'));


/** 读取流*/
var data = '';
readStream.on('data',function(chunk){
    console.log(chunk);
    data +=chunk;
});

readStream.on('end', function(){
    console.log(data);
});


/** 写入流*/
writeStream.write('hello world');
writeStream.end();




/** 管道流流入 */
// readStream.pipe(writeStream);
var fs = require('fs');
var path = require('path');

/**
 *
 * fs.readFile
 * fs.writefile
 * fs.rmdir
 * fs.readdir
 * fs.mkdir
 * fs.unlink
 * fs.stat
 * fs.read
 *
 * */



//读文件
function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    });
}

//写文件
function writeFile(filepath, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filepath, data, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve('success');
            }
        })
    });
}

//创建目录
function makeDir(parentPath, dirname) {
    const dirPath = path.resolve(parentPath, dirname);
    return new Promise((resolve, reject) => {
        fs.mkdir(dirPath, (err) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve();
                console.log(`${dirPath}创建成功`);
            }
        })
    })

}

/*查询目录文件的信息*/
function fileStat(filePath) {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, function (err, stats) {
            if (err) {
                reject(err);
            } else {
                resolve(stats);
            }
        })
    })
}

/*删除文件*/
function deleteFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filepath, err => {
            if (err) {
                reject(err);
            } else {
                resolve('success');
            }
        })
    })
}


function createReadStream(filePath) {
    return fs.createReadStream(filePath);

}

function createWriteSterem(filePath) {
    return fs.createWriteStream(filePath);
}


// fileStat('/Users/wangshiping/Desktop/workspace/myproject/wsp-cli').then(stats => {
//     console.log('是文件吗？', stats.isFile());
//     console.log('是目录吗 ？', stats.isDirectory())
// }).catch(err => console.log(err));

// makeDir('/Users/wangshiping/Desktop/workspace/myproject/wsp-cli', 'wsp-cli');

// deleteFile('/Users/wangshiping/Desktop/workspace/myproject/wsp-cli/package-lock.json').then(() => {
//     console.log('删除成功！');
// }).catch(err=>{
//     console.log(err)
// });

// writeFile('/var/folders/f3/kx_1km2n5zb__nb4vwc8gw29rfbn86/T/wsp-cli/ssssss.txt',"hello world").then(res=>console.log(res)).catch(err=>console.log(err));

module.exports = {
    readFile,
    writeFile,
    makeDir,
    fileStat,
    createReadStream,
    createWriteSterem

};
var fs = require('fs');

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

module.exports = {
    readFile,
    writeFile
};
const http = require('http');
const fs = require('fs');
const url = require('url');
const util = require('util');
const path = require('path');

/**
 * 两个中间件
 * */
const multiparty = require('multiparty');
const Busboy = require('busboy');

const os = require('os');

const webappBasePath = path.resolve(__dirname,'./webapp');

// console.log(http.METHODS);
// console.log(http.STATUS_CODES);

const server = http.createServer((request, response) => {
    // console.log(request.method);
    // console.log(request.headers);
    const urlPath = url.parse(request.url).pathname;
    if(urlPath.indexOf('/webapp') == 0){
        const filePath = path.resolve(__dirname, '../' , `.${urlPath}`);
        console.log(filePath);
        const fileStream = fs.createReadStream(filePath);
        let data ='';
        fileStream.on('data',function(chunk){
            data += chunk;
        });
        fileStream.on('error',function(error){
            response.write(error);
            response.end();
        });
        fileStream.on('end', function(){
            response.end();
        });
        fileStream.pipe(response);
        return;
    }
    if(urlPath == '/upload' ){
        var form = new multiparty.Form({uploadDir: path.resolve(__dirname,'../files')});
        form.parse(request, function(err, fields,files){
           response.writeHead(200,{'content-type': 'text/plain'});
           response.write('received upload:\n\n');
           console.log(files);
           response.end(util.inspect({fields:fields,files:files}));
        });
        return;
    }

    if(urlPath.indexOf('/uploads') >=0){
        console.log('.......');
        var busboy = new Busboy({headers: request.headers});
        console.log('start');

        busboy.on('file', function(fieldname, file, filename, encoding, mimetype){

            console.log('file stream');

            var saveTo = path.join( os.tmpDir(), path.basename(filename));
            console.log(saveTo);
            file.pipe(fs.createWriteStream(saveTo));
        });
        busboy.on('finish', function(){
            console.log('finish');
            response.writeHead(200,{'content-type':'text/plain'});
            response.end('upload end');
        });
        return request.pipe(busboy);
    }

    response.write('hello world');
    response.end();

});


server.listen(8888);
console.log('server start on port 8888');
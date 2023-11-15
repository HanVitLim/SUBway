const multer = require('multer');
const uploads = multer({dest: './image/'});
var request = require('request');
const express = require('express');

var fs = require('fs');
function apiuse(path, callback){
    var openApiURL = 'http://aiopen.etri.re.kr:8000/ObjectDetect';
    var accessKey = '';
    var type = 'png';
    var imageFilePath = './image/' + path;
    var imageData;
    
    var imageData = fs.readFileSync(imageFilePath);
    
    var requestJson = {
        'argument': {
            'type': type,
            'file': imageData.toString('base64')
        }
    };
    
    var options = {
        url: openApiURL,
        body: JSON.stringify(requestJson),
        headers: {'Content-Type':'application/json','Authorization':accessKey}
    };

    request.post(options, function (error, response, body) {

        console.log('apiuse responseCode = ' + response.statusCode);
        console.log('apiuse responseBody = ' + body + "\n");

        callback({
            success: true,
            apiclass: body,
            code: response.statusCode,
            path: imageFilePath,
        });
    });
}
module.exports = apiuse;
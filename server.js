const express = require('express');
var app = express();
var server = require('http').createServer(app);

const publicRouter = require("./routes/public");
app.use('/', publicRouter);
app.use('/about', publicRouter);
app.use('/contact', publicRouter);
app.use('/projects', publicRouter);

//app.use('/', express.static(__dirname + '/'));
//use reference files located in libs directory
app.use('/libs', express.static(__dirname + '/libs'));
////use image files located in images directory
app.use('/images', express.static(__dirname + '/images'));
////use font files located in font directory
app.use('/fonts', express.static(__dirname + '/fonts'));
////use large files located in file directory
app.use('/files', express.static(__dirname + '/files'));

//Start broadcasting server over specified port
var HTTP_PORT = 8081;
server.listen(HTTP_PORT);
console.log("Running at Port "+HTTP_PORT);
    
//    
    
//    link.find('a:href').each((i, element) => {
//        const $element = $(element);
//        const url = {};
//        url.name = $element.find('a').text();
//        console.log(url);
//    });
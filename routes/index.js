var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var moment = require('moment');
var marked = require('marked');
var cheerio = require('cheerio');
var crypto = require('crypto');
var formidable = require('formidable');
var fs = require('fs');
var s = require('../settings');

// 连接数据库
mongoose.connect("mongodb://" + s.host + ":" + s.port + "/" + s.db, function onMongooseError(err) {
    if (err) {
        throw err;
    }
});

// 模块
var models = {

}

/* GET home page. */
router.get('/', function(req, res) {
    res.redirect('/index');
});

router.get('/index', function(req, res) {
    res.render('index', {
        title: 'index'
    });
});

// editor
router.get('/editor', function(req, res) {
    res.render('editor', {
        title: '编辑器'
    });
});

// new editor
router.get('/neweditor', function(req, res) {
    res.render('newedit', {
        title: '编辑器'
    });
});

// editor upload
router.post('/editor/upload', function(req, res) {
    // res.header('Context-Type', 'text/plain');
    var form = new formidable.IncomingForm();
    var fields = [];
    var files = [];
    form.uploadDir = '../public/uploads';
    form.keepExtensions = true;
    form.on('progress', function(bytesReceived, bytesExpected) {
        var _now_progress = parseInt(bytesReceived / bytesExpected * 10000) / 100;
        console.log("now is " + _now_progress + '%');
    }).on('field', function(field, value) {
        fields.push([field, value]);
    }).on('file', function(field, file) {
        files.push([field, file]);
    }).on('end', function() {
        console.log('upload done');
    }).on('error', function(err) {
        console.log(err);
    });
    form.parse(req, function(err, fields, files) {
        var file_path = files.addimage.path;
        var file_name = files.addimage.name;
        var new_file_name = Date.now() + "_" + file_name;
        var new_file_path = form.uploadDir + '/' + new_file_name;
        fs.renameSync(file_path, new_file_path);
        var data = {
            msg: 'ok',
            error: '',
            filePath: '/uploads/' + new_file_name
        };
        res.end(JSON.stringify(data));
    });
});

module.exports = router;